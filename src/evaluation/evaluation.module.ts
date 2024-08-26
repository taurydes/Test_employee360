import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation, EvaluationSchema } from './schemas/evaluation.schema';
import { Question, QuestionSchema } from './schemas/question.schema';
import { Answer, AnswerSchema } from './schemas/answer.schema';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Employee, EmployeeSchema } from 'src/employee/schemas/employee.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evaluation.name, schema: EvaluationSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Answer.name, schema: AnswerSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MailModule
  ],
  controllers: [EvaluationController,QuestionController],
  providers: [EvaluationService,QuestionService],
})
export class EvaluationModule {}
