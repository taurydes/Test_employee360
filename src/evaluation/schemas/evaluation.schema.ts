import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { QuestionDocument } from './question.schema';
import { EvaluationStatus } from '../evaluations.constants';

export type EvaluationDocument = Evaluation & Document;

@Schema()
export class Evaluation {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  period: string;

  @Prop({ required: true, enum: [EvaluationStatus.InProgress, EvaluationStatus.Completed] })
  status: EvaluationStatus;

  @Prop({ required: true, enum: ['self', 'peer', 'manager'] })
  type: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }] })
  questions: Types.ObjectId[];
  

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
