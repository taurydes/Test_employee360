import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { CreateQuestionBaseDto, CreateQuestionDto } from './dto/create-question.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QuestionService } from './question.service';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /**
   * @summary Crear nueva pregunta
   * @param createQuestionDto - Datos de la pregunta a crear
   * @returns La pregunta creada
   * @throws NotFoundException si la evaluación no existe
   */
  @Auth()
  @Post()
  @ApiOperation({ summary: 'Crear nueva pregunta' })
  create(@Body() createQuestionDto: CreateQuestionBaseDto) {
    return this.questionService.create(createQuestionDto);
  }

  /**
   * @summary Listar todas las preguntas
   * @returns Una lista de preguntas
   */
  @Auth()
  @Get()
  @ApiOperation({ summary: 'Listar todas las preguntas' })
  findAll() {
    return this.questionService.findAll();
  }

  /**
   * @summary Obtener detalles de una pregunta
   * @param id - ID de la pregunta a buscar
   * @returns La pregunta encontrada con sus respuestas asociadas
   * @throws NotFoundException si la pregunta no existe
   */
  @Auth()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de una pregunta' })
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  /**
   * @summary Actualizar una pregunta
   * @param id - ID de la pregunta a actualizar
   * @param updateQuestionDto - Datos a actualizar
   * @returns La pregunta actualizada con sus respuestas asociadas
   * @throws NotFoundException si la pregunta no existe
   */
  @Auth()
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una pregunta' })
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, updateQuestionDto);
  }
}
