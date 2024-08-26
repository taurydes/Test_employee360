import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAnswerScoreDto {
  @ApiProperty({ description: 'ID de la pregunta'})
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
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
  @IsMongoId()
  evaluationId: string;

  @ApiProperty({ description: 'ID del revisor' })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  reviewerId: string;

  @ApiProperty({ description: 'Array de respuestas con sus puntuaciones', type: [CreateAnswerScoreDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerScoreDto)
  responses: CreateAnswerScoreDto[];
}
