import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAnswerScoreDto {
  @ApiProperty({ description: 'ID de la pregunta'})
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @ApiProperty({ description: 'Puntuación de la respuesta'})
  @IsNotEmpty()
  @IsNumber()
  responseScore: number;
}

export class CreateEvaluationResponseDto {
  @ApiProperty({ description: 'ID de la evaluación'})
  @IsNotEmpty()
  @IsString()
  evaluationId: string;

  @ApiProperty({ description: 'ID del revisor' })
  @IsNotEmpty()
  @IsString()
  reviewerId: string;

  @ApiProperty({ description: 'Array de respuestas con sus puntuaciones', type: [CreateAnswerScoreDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerScoreDto)
  responses: CreateAnswerScoreDto[];
}
