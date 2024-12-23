import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('Test Service')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Hello world' })
  @ApiResponse({ status: 200, description: 'Hello World!' })
  @Get()
  getHello(@Res() res) {
    return res.status(HttpStatus.OK).json(this.appService.getHello());
  }
}
