import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    default: 'test@yopmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'Abcd1234.' })
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  password: string;
}
