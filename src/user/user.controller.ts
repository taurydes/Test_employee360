import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { userRoles } from 'src/common/constants';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @summary Listar todos los usuarios
   * @returns Una lista de usuarios
   */
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * @summary Obtener un usuario por ID
   * @param id - ID del usuario a buscar
   * @returns El usuario encontrado
   * @throws NotFoundException si el usuario no existe
   */

  @Auth(userRoles.Manager,userRoles.Admin)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   * @summary Actualizar un usuario por ID
   * @param id - ID del usuario a actualizar
   * @param updateUserDto - Datos a actualizar
   * @returns El usuario actualizado
   * @throws NotFoundException si el usuario no existe
   */
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * @summary Eliminar un usuario por ID
   * @param id - ID del usuario a eliminar
   * @returns void
   * @throws NotFoundException si el usuario no existe
   */
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @Auth(userRoles.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
