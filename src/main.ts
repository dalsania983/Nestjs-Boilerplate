import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import config from '../config/configuration';
import { ResponseInterceptor } from './common/middleware/log.middleware';

async function bootstrap() {
  const variables = config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error for extra properties
      transform: true, // Automatically transforms types
      errorHttpStatusCode: 422, // Use HTTP 422 Unprocessable Entity for validation errors
    }),
  );
  await app.listen(variables.port, () => {
    console.log(`App is listening on http://localhost:${variables.port}`);
  });
}
bootstrap();
