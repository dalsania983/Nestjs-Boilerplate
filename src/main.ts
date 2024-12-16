import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from '../config/configuration';
import { ResponseInterceptor } from './common/middleware/log.middleware';

async function bootstrap() {
  const variables = config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(variables.port, () => {
    console.log(`App is listening on http://localhost:${variables.port}`);
  });
}
bootstrap();
