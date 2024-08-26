import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignReviewersDto {
  @ApiProperty({
    description: 'ID de la evaluación a la que se asignarán los revisores',
    example: '60c72b2f4f1a4c001f8d4e68',
  })
  @IsNotEmpty()
  @IsMongoId()
  evaluationId: string;

  @ApiProperty({
    description: 'Array de IDs de los evaluadores a asignar',
    type: [String],
    example: ['60c72b2f4f1a4c001f8d4e69', '60c72b2f4f1a4c001f8d4e6a'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  reviewerIds: string[];
}
