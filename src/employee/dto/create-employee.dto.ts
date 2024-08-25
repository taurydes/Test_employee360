import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsEnum, IsDateString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Name of the employee' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email of the employee' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Role of the employee', enum: ['admin', 'manager', 'employee'] })
  @IsNotEmpty()
  @IsEnum(['admin', 'manager', 'employee'])
  role: string;

  @ApiProperty({ description: 'Position of the employee' })
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty({ description: 'Department of the employee' })
  @IsNotEmpty()
  @IsString()
  department: string;

  @ApiProperty({ description: 'Start date of the employee' })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;
}
