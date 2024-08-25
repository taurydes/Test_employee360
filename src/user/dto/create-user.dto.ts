import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsEnum } from 'class-validator';
import { userRoles } from 'src/common/constants';

export class CreateUserDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'Password for the user' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'Role of the user', enum: userRoles })
  @IsNotEmpty()
  @IsString()
  @IsEnum(userRoles)
  role: number;
}
