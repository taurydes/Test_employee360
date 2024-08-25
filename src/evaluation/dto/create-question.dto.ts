import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { CreateAnswerDto } from './create-answer.dto';


export class CreateQuestionDto {
  @ApiProperty({ description: 'Text of the question' })
  @IsNotEmpty()
  @IsString()
  text: string;
}
export class CreateQuestionBaseDto extends CreateQuestionDto {
  @ApiProperty({ description: 'Text of the question' })
  @IsNotEmpty()
  @IsString()
  evaluationId: string;
}


