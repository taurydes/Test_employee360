import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  /**
   * @summary Crear un nuevo empleado
   * @param createEmployeeDto - Datos del empleado a crear
   * @returns El empleado creado
   * @throws BadRequestException si el empleado ya existe (opcional)
   */
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeeModel
      .findOne({ email: createEmployeeDto.email })
      .exec();
    if (existingEmployee) {
      throw new BadRequestException(
        `Employee with email "${createEmployeeDto.email}" already exists`,
      );
    }

    const newEmployee = new this.employeeModel(createEmployeeDto);
    return newEmployee.save();
  }

  /**
   * @summary Listar todos los empleados
   * @returns Una lista de empleados
   */
  async findAll(): Promise<Employee[]> {
    return this.employeeModel.find().exec();
  }

  /**
   * @summary Encontrar un empleado por ID
   * @param id - ID del empleado a buscar
   * @returns El empleado encontrado
   * @throws BadRequestException si el ID es inválido
   * @throws NotFoundException si el empleado no existe
   */
  async findOne(id: string): Promise<Employee> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const employee = await this.employeeModel
    .findById(new Types.ObjectId(id))
    .populate({
      path: 'evaluations',
      populate: {
        path: 'questions',
        populate: {
          path: 'answers',
        },
      },
    })
    .exec();
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  /**
   * @summary Actualizar un empleado
   * @param id - ID del empleado a actualizar
   * @param updateEmployeeDto - Datos a actualizar
   * @returns El empleado actualizado
   * @throws BadRequestException si el ID es inválido
   * @throws NotFoundException si el empleado no existe
   */
  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(new Types.ObjectId(id), updateEmployeeDto, { new: true })
      .exec();
    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return updatedEmployee;
  }

  /**
   * @summary Eliminar un empleado y manejar las relaciones para evitar inconsistencias
   * @param id - ID del empleado a eliminar
   * @throws BadRequestException si el ID es inválido
   * @throws NotFoundException si el empleado no existe
   */
  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const result = await this.employeeModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
    if (!result) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }
}
