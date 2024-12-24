import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ApplicationLogsService } from 'src/application-logs/application-logs.service';
import { ApplicationLogsController } from './application-log.controller';
import { LoggerMiddleware } from 'src/common/middleware/log.middleware';

@Module({
  imports: [],
  providers: [ApplicationLogsService],
  controllers: [ApplicationLogsController],
  exports: [],
})
export class ApplicationLogsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ApplicationLogsController);
  }
}
