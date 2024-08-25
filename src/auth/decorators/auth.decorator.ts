import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard.guard';

export function Auth() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
  );
}
