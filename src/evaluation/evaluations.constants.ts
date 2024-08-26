import { Document, ObjectId, Types } from 'mongoose';

export enum EvaluationStatus {
  InProgress = 'in_progress',
  Completed = 'completed',
}

export interface IQuestionDocument extends Document {
  _id: Types.ObjectId;
  text: string;
  answers: Types.ObjectId[];
  evaluationId: Types.ObjectId;
}

export interface EvaluationResponse {
  _id: Types.ObjectId;
  period: string;
  status: string;
  type: string;
  questions: QuestionWithAnswers[];
  reviewerIds: ReviewerScore[];
}

export interface QuestionWithAnswers {
  _id: Types.ObjectId;
  text?: string;
  answers: AnswerWithQuestion[];
}

export interface AnswerWithQuestion {
  _id: Types.ObjectId;
  score: number;
  question: {
    _id: Types.ObjectId;
  };
}

export interface ReviewerScore {
  _id: ObjectId; 
  reviewerId: ObjectId;
  score: number;
  answerId: ObjectId;
}
