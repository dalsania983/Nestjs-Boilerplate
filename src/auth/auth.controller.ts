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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto, LogoutDto } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'You Successfully logged in.' })
  @ApiResponse({
    status: 401,
    description: 'You are Unauthorized to lobed in.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: LoginDto, required: true })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginDto: LoginDto, @Ip() ip, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(loginDto, ip);
      if (result.error) {
        return res
          .status(result.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
          .json(result);
      }
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(error?.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: error?.response?.message ?? 'Internal Server Error.',
          ...error.response,
        });
    }
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'You Successfully logged out.' })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed. Please log in again.',
  })
  @ApiResponse({ status: 502, description: 'User Instance not found.' })
  @ApiBody({ type: LogoutDto, required: true })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@Body() logoutDto: LogoutDto, @Res() res: Response) {
    try {
      const { token } = logoutDto;
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
