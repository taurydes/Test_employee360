import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsInt, Max } from 'class-validator';


export class CreateAnswerDto {
    @ApiProperty({ description: 'Puntuación de la respuesta', minimum: 1, maximum: 5 })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    score: number;
}
