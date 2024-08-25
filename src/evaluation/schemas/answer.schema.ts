import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnswerDocument = Answer & Document;

@Schema()
export class Answer {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question' })
  questionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee' })
  respondentId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })  
  score: number;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
