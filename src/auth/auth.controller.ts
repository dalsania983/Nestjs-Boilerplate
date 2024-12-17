import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
