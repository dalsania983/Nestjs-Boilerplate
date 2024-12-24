import { MiddlewareConsumer, Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ApplicationLogsService } from 'src/application-logs/application-logs.service';
import { LoggerMiddleware } from 'src/common/middleware/log.middleware';

@Module({
  imports: [],
  providers: [UsersService, ApplicationLogsService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UsersController);
  }
}
