// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { userRoles } from 'src/common/constants';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: userRoles[]) => SetMetadata(ROLES_KEY, roles);
