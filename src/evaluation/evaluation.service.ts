import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Evaluation, EvaluationDocument } from './schemas/evaluation.schema';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { Answer, AnswerDocument } from './schemas/answer.schema';
import { Question, QuestionDocument } from './schemas/question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { CreateEvaluationResponseDto } from './dto/create-response.dto';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectModel(Evaluation.name)
    private evaluationModel: Model<EvaluationDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
  ) {}

  /**
   * @summary Crear una nueva evaluación con preguntas y respuestas asociadas
   * @param createEvaluationDto - Datos de la evaluación a crear, incluyendo preguntas y respuestas
   * @returns La evaluación creada con sus preguntas y respuestas
   */
  async createEvaluation(
    createEvaluationDto: CreateEvaluationDto,
  ): Promise<Evaluation> {
    const newEvaluation = new this.evaluationModel({
      period: createEvaluationDto.period,
      status: createEvaluationDto.status,
      type: createEvaluationDto.type,
    });
    await newEvaluation.save();

    for (const questionDto of createEvaluationDto.questions) {
      const newQuestion = new this.questionModel({
        text: questionDto.text,
        evaluationId: newEvaluation._id,
      });
      await newQuestion.save();

      newEvaluation.questions.push(newQuestion);
    }

    await newEvaluation.save();

    return this.evaluationModel
      .findById(new Types.ObjectId(newEvaluation._id))
      .populate('questions')
      .exec();
  }

  /**
   * @summary Listar todas las evaluaciones con detalles de revisores y sus respuestas
   * @returns Una lista de evaluaciones con sus revisores y las respuestas de los revisores
   */
  async findAll(): Promise<Evaluation[]> {
    return this.evaluationModel
      .find()
      .populate({
        path: 'questions',
        populate: {
          path: 'answers',
          populate: {
            path: 'respondentId',
            select: 'name email',
          },
        },
      })
      .exec();
  }

  /**
   * @summary Encontrar una evaluación por ID
   * @param id - ID de la evaluación a buscar
   * @returns La evaluación encontrada con preguntas, respuestas y revisores
   * @throws NotFoundException si la evaluación no existe
   */
  async findOne(id: string): Promise<Evaluation> {
    const objectId = new Types.ObjectId(id);
    const evaluation = await this.evaluationModel
      .findById(objectId)
      .populate({
        path: 'questions',
        populate: {
          path: 'answers',
          populate: {
            path: 'respondentId',
            select: 'name email',
          },
        },
      })
      .exec();
  
    if (!evaluation) {
      throw new NotFoundException(`Evaluation with ID "${id}" not found`);
    }
  
    return evaluation;
  }

  /**
   * @summary Actualizar una evaluación
   * @param id - ID de la evaluación a actualizar
   * @param updateEvaluationDto - Datos a actualizar
   * @returns La evaluación actualizada
   * @throws NotFoundException si la evaluación no existe
   */
  async update(
    id: string,
    updateEvaluationDto: UpdateEvaluationDto,
  ): Promise<Evaluation> {
    const objectId = new Types.ObjectId(id);
    const updatedEvaluation = await this.evaluationModel
      .findByIdAndUpdate(objectId, updateEvaluationDto, {
        new: true,
      })
      .exec();
    if (!updatedEvaluation) {
      throw new NotFoundException(`Evaluation with ID "${id}" not found`);
    }
    return updatedEvaluation;
  }

  /**
   * @summary Marcar una evaluación como completada
   * @param id - ID de la evaluación a completar
   * @returns La evaluación completada
   * @throws NotFoundException si la evaluación no existe
   */
  async submit(id: string): Promise<Evaluation> {
    const objectId = new Types.ObjectId(id);
    const evaluation = await this.evaluationModel.findById(objectId).exec();
    if (!evaluation) {
      throw new NotFoundException(`Evaluation with ID "${id}" not found`);
    }

    evaluation.status = 'completed';
    evaluation.submittedAt = new Date();
    return evaluation.save();
  }

 /**
 * @summary Calcular la puntuación de una evaluación
 * @param id - ID de la evaluación
 * @returns La evaluación con la puntuación calculada para cada pregunta
 * @throws NotFoundException si la evaluación no existe
 */
async calculateScore(id: string): Promise<Evaluation> {
  const objectId = new Types.ObjectId(id);
  const evaluation = await this.evaluationModel
    .findById(objectId)
    .populate({
      path: 'questions',
      populate: {
        path: 'answers',
      },
    })
    .exec();

  if (!evaluation) {
    throw new NotFoundException(`Evaluation with ID "${id}" not found`);
  }

  // Iterar sobre las preguntas para calcular el promedio de puntuación
  for (const question of evaluation.questions as QuestionDocument[]) {
    let totalScore = 0;
    let answerCount = 0;

    for (const answer of question.answers as AnswerDocument[]) {
      totalScore += answer['score'] || 0;
      answerCount += 1;
    }

    // Calcular el promedio para la pregunta actual
    const averageScore = answerCount > 0 ? totalScore / answerCount : 0;

    // Agregar el promedio calculado a la pregunta
    question['averageScore'] = averageScore;

    // Guardar la pregunta actualizada en la base de datos
    await this.questionModel.findByIdAndUpdate(
      question._id,
      { averageScore },
      { new: true }
    ).exec();
  }

  // Devolver la evaluación con los promedios calculados
  return this.evaluationModel
    .findById(objectId)
    .populate({
      path: 'questions',
      populate: {
        path: 'answers',
      },
    })
    .exec();
}


/**
 * @summary Asignar evaluadores a una evaluación
 * @param evaluationId - ID de la evaluación
 * @param reviewerIds - IDs de los evaluadores a asignar
 * @returns La evaluación con los evaluadores asignados
 * @throws NotFoundException si la evaluación no existe
 */
async assignReviewers(
  evaluationId: string,
  reviewerIds: string[],
): Promise<Evaluation> {
  const objectId = new Types.ObjectId(evaluationId);
  const evaluation = await this.evaluationModel.findById(objectId).exec();

  if (!evaluation) {
    throw new NotFoundException(
      `Evaluation with ID "${evaluationId}" not found`,
    );
  }

  evaluation.reviewerIds = reviewerIds.map((id) => ({
    reviewerId: new Types.ObjectId(id),
    score: 0, // Puedes ajustar este valor según lo necesario
    answerId: new Types.ObjectId(), // Este debe ser el ID de la respuesta correspondiente si existe
  }));

  return evaluation.save();
}

/**
   * @summary Añadir múltiples respuestas a una evaluación
   * @param createEvaluationResponseDto - Datos de la evaluación y las respuestas a crear
   * @returns La evaluación con las respuestas añadidas
   * @throws NotFoundException si la evaluación o alguna pregunta no existe
   */
async addAnswer(
  createEvaluationResponseDto: CreateEvaluationResponseDto,
): Promise<Evaluation> {
  const { evaluationId, responses, reviewerId } = createEvaluationResponseDto;

  // Verificar la evaluación
  const evaluation = await this.evaluationModel
    .findById(new Types.ObjectId(evaluationId))
    .exec();
  if (!evaluation) {
    throw new NotFoundException(
      `Evaluation with ID "${evaluationId}" not found`,
    );
  }

  for (const responseDto of responses) {
    const { questionId, responseScore } = responseDto;

    // Verificar la pregunta
    const question = await this.questionModel
      .findById(new Types.ObjectId(questionId))
      .exec();
    if (!question) {
      throw new NotFoundException(
        `Question with ID "${questionId}" not found`,
      );
    }

    // Crear la nueva respuesta asociada al revisor
    const newAnswer = new this.answerModel({
      questionId: question._id,
      score: responseScore,
      respondentId: new Types.ObjectId(reviewerId), // Asociar la respuesta al revisor
    });

    await newAnswer.save();

    // Asociar la respuesta a la pregunta
    question.answers.push(newAnswer._id);
    await question.save();

    // Asociar la respuesta al revisor dentro de la evaluación
    evaluation.reviewerIds.push({
      reviewerId: new Types.ObjectId(reviewerId),
      score: responseScore,
      answerId: newAnswer._id,
    });
  }

  await evaluation.save();

  // Popula las preguntas y respuestas correctamente
  return this.evaluationModel
    .findById(new Types.ObjectId(evaluationId))
    .populate({
      path: 'questions',
      populate: {
        path: 'answers',
        model: 'Answer',
      },
    })
    .exec();
}


}

