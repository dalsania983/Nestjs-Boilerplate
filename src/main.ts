import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import config from '../config/configuration';
import { ResponseInterceptor } from './common/middleware/log.middleware';

async function bootstrap() {
  const variables = config();
  const app = await NestFactory.create(AppModule);

  if (variables.enableSwagger) {
    const documentConfig = new DocumentBuilder()
      .setTitle('Nest js Boilerplate')
      .setDescription('The Nest js Boilerplate API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer(`http://localhost:${variables.port}`, 'Local Environment')
      .addServer('https://app.example.com', 'Staging Environment')
      .addServer('https://dev.example.com', 'Development Environment')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup('swagger', app, documentFactory);

    // Serve the Swagger JSON document
    app.getHttpAdapter().get('/swagger-json', (_, res) => {
      res.json(document);
    });
  }
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error for extra properties
      transform: true, // Automatically transforms types
      errorHttpStatusCode: 422, // Use HTTP 422 Unprocessable Entity for validation errors
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
  });
  app.setGlobalPrefix('api/');

  await app.listen(variables.port, () => {
    console.log(`App is listening on http://localhost:${variables.port}`);
  });
}
bootstrap();
