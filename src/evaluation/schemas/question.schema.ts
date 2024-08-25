import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AnswerDocument } from './answer.schema';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Answer' }] })
  answers: (Types.ObjectId | AnswerDocument)[];

  @Prop({ type: Types.ObjectId, ref: 'Evaluation' })
  evaluationId: Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
