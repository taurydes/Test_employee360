import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { CreateQuestionBaseDto, CreateQuestionDto } from './dto/create-question.dto';
import { Evaluation, EvaluationDocument } from '../evaluation/schemas/evaluation.schema';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(Evaluation.name) private evaluationModel: Model<EvaluationDocument>,
  ) {}

  /**
   * @summary Crear una nueva pregunta y asociarla a una evaluación existente
   * @param createQuestionDto - Datos de la pregunta a crear
   * @returns La pregunta creada
   * @throws NotFoundException si la evaluación no existe
   */
  async create(createQuestionDto: CreateQuestionBaseDto): Promise<Question> {
    const { evaluationId } = createQuestionDto;

    const objectId = new Types.ObjectId(evaluationId);
    const evaluation = await this.evaluationModel.findById(objectId).exec();
    if (!evaluation) {
      throw new NotFoundException(`Evaluation with ID ${evaluationId} not found`);
    }

    const newQuestion = new this.questionModel(createQuestionDto);
    const savedQuestion = await newQuestion.save();

    evaluation.questions.push(savedQuestion._id);
    await evaluation.save();

    return savedQuestion;
  }

  /**
   * @summary Listar todas las preguntas, incluyendo respuestas si las tienen
   * @returns Una lista de preguntas con sus respuestas asociadas
   */
  async findAll(): Promise<Question[]> {
    return this.questionModel
      .find()
      .populate('answers') 
      .exec();
  }

  /**
   * @summary Obtener detalles de una pregunta específica por ID, incluyendo respuestas
   * @param id - ID de la pregunta a buscar
   * @returns La pregunta encontrada con sus respuestas asociadas
   * @throws NotFoundException si la pregunta no existe
   */
  async findOne(id: string): Promise<Question> {
    const objectId = new Types.ObjectId(id);
    const question = await this.questionModel
      .findById(objectId)
      .populate('answers') 
      .exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  /**
   * @summary Actualizar una pregunta por ID
   * @param id - ID de la pregunta a actualizar
   * @param updateQuestionDto - Datos a actualizar
   * @returns La pregunta actualizada con sus respuestas asociadas
   * @throws NotFoundException si la pregunta no existe
   */
  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const objectId = new Types.ObjectId(id);
    const updatedQuestion = await this.questionModel
      .findByIdAndUpdate(objectId, updateQuestionDto, { new: true })
      .populate('answers') 
      .exec();
    if (!updatedQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return updatedQuestion;
  }
  
}
