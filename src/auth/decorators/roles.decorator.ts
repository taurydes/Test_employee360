// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { RolesGuard } from '../guards/RolesGuard.guard';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
