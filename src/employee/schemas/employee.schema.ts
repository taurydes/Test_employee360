import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ default: uuidv4 })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ type: [{ type: String, ref: 'Evaluation' }] })
  evaluations: string[];
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
