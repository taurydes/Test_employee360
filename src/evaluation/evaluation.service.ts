import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import {
  Employee,
  EmployeeDocument,
} from 'src/employee/schemas/employee.schema';
import { EvaluationStatus, IQuestionDocument } from './evaluations.constants';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { AssignReviewersDto } from './dto/assign-reviewers.dto';
import { MailParams } from 'src/mail/mail.constants';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectModel(Evaluation.name)
    private evaluationModel: Model<EvaluationDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
  ) {}

  /**
   * @summary Crear una nueva evaluación con preguntas y respuestas asociadas
   * @param createEvaluationDto - Datos de la evaluación a crear, incluyendo preguntas y respuestas
   * @returns La evaluación creada con sus preguntas y respuestas
   */
  async createEvaluation(
    createEvaluationDto: CreateEvaluationDto,
  ): Promise<Evaluation> {
    const employee = await this.employeeModel
      .findById(new Types.ObjectId(createEvaluationDto.employeeId))
      .exec();
    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${createEvaluationDto.employeeId} not found`,
      );
    }

    const newEvaluation = new this.evaluationModel({
      period: createEvaluationDto.period,
      status: createEvaluationDto.status,
      type: createEvaluationDto.type,
      employeeId: createEvaluationDto.employeeId,
    });

    await newEvaluation.save();

    // Agregar la evaluación al empleado
    employee.evaluations.push(newEvaluation._id);
    await employee.save();

    for (const questionDto of createEvaluationDto.questions) {
      const newQuestion = new this.questionModel({
        text: questionDto.text,
        evaluationId: newEvaluation._id,
      });

      await newQuestion.save();

      newEvaluation.questions.push(newQuestion._id);
    }

    await newEvaluation.save();

    return this.evaluationModel
      .findById(newEvaluation._id)
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
      .populate({
        path: 'reviewerIds',
        populate: {
          path: 'reviewerId',
          select: 'name email',
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
  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const objectId = new Types.ObjectId(id);

    const evaluation = await this.evaluationModel
      .findById(objectId)
      .populate({
        path: 'questions',
        select: '_id',
      })
      .exec();

    if (!evaluation) {
      throw new NotFoundException(`Evaluation with ID "${id}" not found`);
    }

    // Obtener todas las respuestas
    const answersWithQuestions = await this.findAllAnswersWithQuestions();

    // Mapear respuestas por pregunta
    const answersMap = answersWithQuestions.reduce(
      (acc, answer) => {
        if (!acc[answer.question._id]) {
          acc[answer.question._id] = [];
        }
        acc[answer.question._id].push(answer);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    // Formatear el resultado
    const result = {
      _id: evaluation._id,
      period: evaluation.period,
      status: evaluation.status,
      type: evaluation.type,
      questions: evaluation.questions.map((question) => {
        const q = question as any;
        return {
          _id: q._id,
          text: q.text, // Asegúrate de que 'text' está en el modelo de pregunta si lo necesitas
          answers: answersMap[q._id.toString()] || [],
        };
      }),
      reviewerIds: evaluation.reviewerIds,
    };

    return result;
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
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
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
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const objectId = new Types.ObjectId(id);
    const evaluation = await this.evaluationModel.findById(objectId).exec();
    if (!evaluation) {
      throw new NotFoundException(`Evaluation with ID "${id}" not found`);
    }

    evaluation.status = EvaluationStatus.Completed;
    evaluation.submittedAt = new Date();
    return evaluation.save();
  }

  /**
   * @summary Calcular la puntuación de una evaluación
   * @param id - ID de la evaluación
   * @returns La evaluación con la puntuación calculada para cada pregunta
   * @throws NotFoundException si la evaluación no existe
   */
  async calculateScore(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const objectId = new Types.ObjectId(id);

    // Usamos findOne para obtener la evaluación y sus preguntas con respuestas
    const evaluation = await this.findOne(id); // Usa tu método findOne

    if (!evaluation) {
      throw new NotFoundException(`Evaluation with ID "${id}" not found`);
    }

    // Calcular el promedio de puntuación para cada pregunta
    const questionsWithScores = evaluation.questions.map((question) => {
      let totalScore = 0;
      let answerCount = 0;

      // Filtrar las respuestas de la pregunta
      const answers = question.answers || [];
      for (const answer of answers) {
        totalScore += answer.score || 0;
        answerCount += 1;
      }

      // Calcular el promedio para la pregunta actual
      const averageScore = answerCount > 0 ? totalScore / answerCount : 0;

      // Retornar la pregunta con el promedio calculado
      return {
        ...question,
        averageScore,
      };
    });

    // Devolver la evaluación con los promedios calculados
    return {
      _id: evaluation._id,
      period: evaluation.period,
      status: evaluation.status,
      type: evaluation.type,
      reviewerIds: evaluation.reviewerIds,
      questions: questionsWithScores,
    };
  }

  /**
   * @summary Asignar evaluadores a una evaluación
   * @param evaluationId - ID de la evaluación
   * @param reviewerIds - IDs de los evaluadores a asignar
   * @returns La evaluación con los evaluadores asignados
   * @throws NotFoundException si la evaluación no existe
   */
  async assignReviewers(
    assignReviewersDto: AssignReviewersDto,
  ): Promise<Evaluation> {
    const evaluationId = new Types.ObjectId(assignReviewersDto.evaluationId);
    const evaluation = await this.evaluationModel.findById(evaluationId).exec();

    if (!evaluation) {
      throw new NotFoundException(
        `Evaluación con ID "${assignReviewersDto.evaluationId}" no encontrada`,
      );
    }

    const reviewers = await this.userModel
      .find({
        _id: {
          $in: assignReviewersDto.reviewerIds.map(
            (id) => new Types.ObjectId(id),
          ),
        },
      })
      .exec();
    if (reviewers.length !== assignReviewersDto.reviewerIds.length) {
      throw new NotFoundException('Uno o más IDs de revisores son inválidos');
    }

    evaluation.reviewerIds = assignReviewersDto.reviewerIds.map((id) => ({
      reviewerId: new Types.ObjectId(id),
      score: 0,
      answerId: null,
    }));

    await evaluation.save();

    // Enviar correo electrónico de notificación a cada revisor
    for (const reviewer of reviewers) {
      const mailParams: MailParams = {
        to: reviewer.email,
        subject: 'Nueva Asignación de Evaluación',
        content: `Has sido asignado a una nueva evaluación. Por favor, inicia sesión en tu cuenta para completar la evaluación.`,
      };

      try {
        await this.mailService.send(mailParams);
      } catch (error) {
        console.error(
          `Error al enviar correo a ${reviewer.email}:`,
          error.message,
        );
        // Aquí podrías agregar lógica adicional, como registrar el error o notificar a un administrador
      }
    }

    return evaluation;
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

    // Verificar si el revisor está en la lista de evaluadores
    const isReviewer = evaluation.reviewerIds.some(
      (r) => r.reviewerId.toString() === reviewerId,
    );
    if (!isReviewer) {
      throw new ForbiddenException(
        'You are not authorized to respond to this evaluation.',
      );
    }

    // Verificar el estado de la evaluación
    if (evaluation.status === EvaluationStatus.Completed) {
      throw new ConflictException(
        'Cannot add answers to a completed evaluation.',
      );
    }

    // Procesar cada respuesta
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
        respondentId: new Types.ObjectId(reviewerId),
      });

      await newAnswer.save();

      // Asociar la respuesta a la pregunta
      question.answers.push(newAnswer._id);
      await question.save();

      // Asociar la respuesta al revisor dentro de la evaluación
      evaluation.reviewerIds = evaluation.reviewerIds.map((r) =>
        r.reviewerId.toString() === reviewerId
          ? { ...r, score: responseScore, answerId: newAnswer._id }
          : r,
      );

      await evaluation.save();
    }

    // Volver a cargar la evaluación con las preguntas y respuestas actualizadas
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

  /**
   * @summary Buscar todas las respuestas y mostrar a qué pregunta pertenecen
   * @returns Un objeto con las respuestas y la pregunta a la que pertenecen
   */
  async findAllAnswersWithQuestions(): Promise<any> {
    // Obtener todas las respuestas
    const answers = await this.answerModel
      .find()
      .populate({
        path: 'questionId',
        select: 'text', // Seleccionar el texto de la pregunta
      })
      .exec();

    // Formatear las respuestas para incluir la pregunta a la que pertenecen
    const answersWithQuestions = answers.map((answer) => ({
      _id: answer._id,
      score: answer.score,
      question: {
        _id: answer.questionId._id,
      },
    }));

    return answersWithQuestions;
  }
}
