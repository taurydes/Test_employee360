import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * @summary Crear un nuevo usuario con hash de contraseña
   * @param createUserDto - Datos del usuario a crear
   * @returns El usuario creado
   * @throws BadRequestException si el email ya está registrado
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;
  
    const existingUser = await this.userModel.findOne({ $or: [{ email }, { username }] }).exec();
    if (existingUser) {
      throw new BadRequestException(`User with email "${email}" or username "${username}" already exists`);
    }
  
    const hashedPassword = await bcrypt.hash(password, 12);
  
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
  
    return createdUser.save();
  }

  /**
   * @summary Listar todos los usuarios, excluyendo la contraseña
   * @returns Una lista de usuarios
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  /**
   * @summary Encontrar un usuario por ID, excluyendo la contraseña
   * @param id - ID del usuario a buscar
   * @returns El usuario encontrado
   * @throws BadRequestException si el ID es inválido
   * @throws NotFoundException si el usuario no existe
   */
  async findOne(id: string): Promise<User> {
    // Convertir el ID a ObjectId
    const objectId = new Types.ObjectId(id);

    const user = await this.userModel.findById(objectId).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  /**
   * @summary Encontrar un usuario por email, excluyendo la contraseña
   * @param email - Email del usuario a buscar
   * @returns El usuario encontrado
   * @throws NotFoundException si el usuario no existe
   */
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return user;
  }

  /**
   * @summary Actualizar un usuario, asegurándose de no sobreescribir la contraseña si no se proporciona
   * @param id - ID del usuario a actualizar
   * @param updateUserDto - Datos a actualizar
   * @returns El usuario actualizado
   * @throws BadRequestException si el ID es inválido
   * @throws NotFoundException si el usuario no existe
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const objectId = new Types.ObjectId(id);

    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    } else {
      delete updateData.password; 
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(objectId, updateData, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return updatedUser;
  }

  /**
   * @summary Eliminar un usuario y manejar las relaciones para evitar inconsistencias
   * @param id - ID del usuario a eliminar
   * @throws BadRequestException si el ID es inválido
   * @throws NotFoundException si el usuario no existe
   */
  async remove(id: string): Promise<void> {
    const objectId = new Types.ObjectId(id);

    const user = await this.userModel.findById(objectId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.userModel.findByIdAndDelete(objectId).exec();
  }
}
