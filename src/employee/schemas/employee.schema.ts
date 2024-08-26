import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId; 

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
  
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Evaluation' }] })  
  evaluations: Types.ObjectId[];
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
