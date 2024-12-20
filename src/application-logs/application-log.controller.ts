import {
  Controller,
  Get,
  Query,
  Param,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApplicationLogsService } from './application-logs.service';
import { GetLogsByUserIdDto } from './application-logs.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('logs')
export class ApplicationLogsController {
  constructor(
    private readonly applicationLogsService: ApplicationLogsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getLogsByUserId(
    @Param('userId') userId: string,
    @Query() query: GetLogsByUserIdDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.applicationLogsService.getLogsByUserId(
        userId,
        query,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(error.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error.', error });
    }
  }
}
