import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateQuestionDto } from './create-question.dto';

export class CreateEvaluationDto {
  @ApiProperty({ description: 'Period of the evaluation' })
  @IsNotEmpty()
  @IsString()
  period: string;

  @ApiProperty({
    description: 'Status of the evaluation',
    enum: ['pending', 'in_progress', 'completed'],
  })
  @IsNotEmpty()
  @IsEnum(['pending', 'in_progress', 'completed'])
  status: string;

  @ApiProperty({
    description: 'Type of the evaluation',
    enum: ['self', 'peer', 'manager'],
  })
  @IsNotEmpty()
  @IsEnum(['self', 'peer', 'manager'])
  type: string;

  @ApiProperty({
    description: 'Array de preguntas de la evaluación',
    type: [CreateQuestionDto],
  })
  @IsArray()
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];

  @ApiProperty({ description: 'Employee ID', type: String })
  @IsNotEmpty()
  @IsMongoId()
  employeeId: Types.ObjectId;
}
