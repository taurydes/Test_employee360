import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-Question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
