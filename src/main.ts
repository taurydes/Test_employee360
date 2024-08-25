import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Employee 360 Evaluation API')
    .setDescription(
      'API para el sistema de evaluación 360 grados de empleados remotos',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Nest application successfully started!`);
  console.log(`Swagger is running on: http://localhost:3000/api`);
}
bootstrap();
