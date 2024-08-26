import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CreateEvaluationResponseDto } from './dto/create-response.dto';
import { userRoles } from 'src/common/constants';
import { AssignReviewersDto } from './dto/assign-reviewers.dto';

@ApiTags('Evaluation')
@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  /**
   * @summary Crear nueva evaluación
   * @param createEvaluationDto - Datos de la evaluación a crear
   * @returns La evaluación creada
   */
  @Auth(userRoles.Manager)
  @Post()
  @ApiOperation({ summary: 'Crear nueva evaluación' })
  create(@Body() createEvaluationDto: CreateEvaluationDto) {
    return this.evaluationService.createEvaluation(createEvaluationDto);
  }

  /**
   * @summary Listar todas las evaluaciones
   * @returns Una lista de evaluaciones
   */
  @Auth(userRoles.Employee)
  @Get()
  @ApiOperation({ summary: 'Listar todas las evaluaciones' })
  findAll() {
    return this.evaluationService.findAll();
  }

  /**
   * @summary Obtener detalles de una evaluación por ID
   * @param id - ID de la evaluación
   * @returns La evaluación encontrada con preguntas, respuestas y revisores
   * @throws NotFoundException si la evaluación no existe
   */
  @Auth(userRoles.Employee)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de una evaluación por ID' })
  findOne(@Param('id') id: string) {
    return this.evaluationService.findOne(id);
  }

  /**
   * @summary Añadir una respuesta a una pregunta existente
   * @param questionId - ID de la pregunta
   * @param createAnswerDto - Datos de la respuesta a crear
   * @returns La respuesta creada
   * @throws NotFoundException si la pregunta no existe
   */
  @Auth(userRoles.Manager)
  @Post('questions/:id/answers')
  @ApiOperation({ summary: 'Responder evaluación' })
  addAnswer(@Body() createAnswerDto: CreateEvaluationResponseDto) {
    return this.evaluationService.addAnswer(createAnswerDto);
  }

  /**
   * @summary Enviar una evaluación completada
   * @param id - ID de la evaluación a enviar
   * @returns La evaluación actualizada con estado "completed"
   * @throws NotFoundException si la evaluación no existe
   */
  @Auth(userRoles.Manager)
  @Post(':id/submit')
  @ApiOperation({ summary: 'Enviar una evaluación completada' })
  submit(@Param('id') id: string) {
    return this.evaluationService.submit(id);
  }

  /**
   * @summary Asignar evaluadores a una evaluación
   * @param evaluationId - ID de la evaluación
   * @param reviewerIds - IDs de los evaluadores a asignar
   * @returns La evaluación con los evaluadores asignados
   * @throws NotFoundException si la evaluación no existe
   */
  @Auth(userRoles.Manager)
  @Patch(':id/assign-reviewers')
  @ApiOperation({ summary: 'Asignar evaluadores a una evaluación' })
  async assignReviewers(@Body() assignReviewersDto: AssignReviewersDto) {
    return this.evaluationService.assignReviewers(assignReviewersDto);
  }

  /**
   * @summary Calcular la puntuación de una evaluación
   * @param id - ID de la evaluación
   * @returns La evaluación con la puntuación calculada
   * @throws NotFoundException si la evaluación no existe
   */
  @Auth(userRoles.Employee)
  @Post(':id/calculate-score')
  @ApiOperation({ summary: 'Calcular la puntuación de una evaluación' })
  calculateScore(@Param('id') id: string) {
    return this.evaluationService.calculateScore(id);
  }
  @Auth(userRoles.Employee)
  @Get('answers/answers-with-questions')
  async getAnswersWithQuestions() {
    return this.evaluationService.findAllAnswersWithQuestions();
  }
}
