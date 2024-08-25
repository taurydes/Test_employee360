import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  /**
   * @summary Crear un nuevo empleado
   * @param createEmployeeDto - Datos del empleado a crear
   * @returns El empleado creado
   */
  @ApiOperation({ summary: 'Crear un nuevo empleado' })
  @Auth()
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  /**
   * @summary Listar todos los empleados
   * @returns Una lista de empleados
   */
  @ApiOperation({ summary: 'Listar todos los empleados' })
  @Auth()
  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  /**
   * @summary Obtener un empleado por ID
   * @param id - ID del empleado a buscar
   * @returns El empleado encontrado
   * @throws NotFoundException si el empleado no existe
   */
  @ApiOperation({ summary: 'Obtener un empleado por ID' })
  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  /**
   * @summary Actualizar un empleado por ID
   * @param id - ID del empleado a actualizar
   * @param updateEmployeeDto - Datos a actualizar
   * @returns El empleado actualizado
   * @throws NotFoundException si el empleado no existe
   */
  @ApiOperation({ summary: 'Actualizar un empleado por ID' })
  @Auth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  /**
   * @summary Eliminar un empleado por ID
   * @param id - ID del empleado a eliminar
   * @returns void
   * @throws NotFoundException si el empleado no existe
   */
  @ApiOperation({ summary: 'Eliminar un empleado por ID' })
  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
