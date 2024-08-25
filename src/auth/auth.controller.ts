import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { Roles } from './decorators/roles.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @summary Iniciar sesión de un usuario
   * @param loginUserDto - Datos de inicio de sesión del usuario
   * @returns Token de acceso JWT si las credenciales son correctas
   */
  @ApiOperation({ summary: 'Iniciar sesión de un usuario' })
  @Roles()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  /**
   * @summary Cerrar sesión de un usuario
   * @returns Mensaje de confirmación de cierre de sesión
   */
  @ApiOperation({ summary: 'Cerrar sesión de un usuario' })
  @Post('logout')
  async logout() {
    return this.authService.logout();
  }
}
