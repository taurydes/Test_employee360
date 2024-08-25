import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUserDto.email }).exec();
    console.log(loginUserDto.email)
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      const { password, ...result } = user.toObject(); // Convertir a objeto plano y excluir la contraseña
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);

    const payload = { username: user.username, sub: user._id, role: user.role };
    console.log('JWT Secret:', this.jwtService.sign(payload)); 
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // El cierre de sesión será manejado en el front eliminando el token
  async logout(): Promise<{ message: string }> {
    return { message: 'Logout successful' };
  }
}
