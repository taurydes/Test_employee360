import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { userRoles, roleHierarchy } from 'src/common/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<userRoles[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; 
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.role) {
      throw new ForbiddenException(); 
    }

    // Verifica si el rol del usuario cumple con el rol requerido
    const hasRole = requiredRoles.some((requiredRole) =>
      this.hasRoleOrHigher(user.role, requiredRole),
    );

    if (!hasRole) {
      throw new ForbiddenException();
    }

    return true;
  }

  /**
   * Determina si el rol del usuario incluye o excede el rol requerido.
   */
  private hasRoleOrHigher(userRole: userRoles, requiredRole: userRoles): boolean {
    const rolesPermitidos = roleHierarchy[userRole] || [];
    return rolesPermitidos.includes(requiredRole);
  }
}
