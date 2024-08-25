import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { QuestionDocument } from './question.schema';

export type EvaluationDocument = Evaluation & Document;

@Schema()
export class Evaluation {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  period: string;

  @Prop({ required: true, enum: ['pending', 'in_progress', 'completed'] })
  status: string;

  @Prop({ required: true, enum: ['self', 'peer', 'manager'] })
  type: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }] })
  questions: (Types.ObjectId | QuestionDocument)[];

  @Prop({ type: Types.ObjectId, ref: 'Employee' })
  employeeId: Types.ObjectId;

  @Prop({
    type: [
      {
        reviewerId: { type: Types.ObjectId, ref: 'User' },
        score: { type: Number },
        answerId: { type: Types.ObjectId, ref: 'Answer' },
      },
    ],
  })
  reviewerIds: {
    reviewerId: Types.ObjectId;
    score: number;
    answerId: Types.ObjectId;
  }[];

  @Prop({ type: Date })
  submittedAt?: Date;
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);
