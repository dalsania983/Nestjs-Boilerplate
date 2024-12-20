import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginDto: LoginDto, @Ip() ip, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(loginDto, ip);
      if (result.error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
      }
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error.', ...error.response });
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@Body() { token }: { token: string }, @Res() res: Response) {
    try {
      const result = await this.authService.logout(token);
      if (result.error) {
        return res.status(HttpStatus.BAD_GATEWAY).json(result);
      }
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(error.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error.', ...error.response });
    }
  }
}
