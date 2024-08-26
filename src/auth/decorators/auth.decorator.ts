import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard.guard';
import { RolesGuard } from '../guards/RolesGuard.guard';
import { userRoles } from 'src/common/constants';

export function Auth(...roles: userRoles[]) {
  return applyDecorators(
    ApiBearerAuth(),
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
