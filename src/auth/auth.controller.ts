import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { Roles } from './decorators/roles.decorator';
import { userRoles } from 'src/common/constants';
import { Auth } from './decorators/auth.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

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
   * @summary Crear un nuevo usuario
   * @param createUserDto - Datos del usuario a crear
   * @returns El usuario creado
   */
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @Post('Register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }
}
