import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto, GetAllUsersDto } from './users.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

type T = any;
@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get Users list' })
  @ApiResponse({ status: 200, description: 'Users fetch successfully.' })
  @ApiResponse({
    status: 401,
    description: 'You are Unauthorized to lobed in.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(
    @Query() getAllUsersDto: GetAllUsersDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.usersService.getUsers(getAllUsersDto);
      if (result.error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
      }
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res
        .status(error.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error.', error });
    }
  }

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Users created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Not able to create User.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication failed. Please log in again.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User already exist in system.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
    @Ip() ip,
  ) {
    try {
      const { uuid }: T = req.user;
      const result = await this.usersService.createUser(
        createUserDto,
        ip,
        uuid,
      );
      if (result.error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
      }
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(error.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: true,
        message: 'Internal Server Error.',
      });
    }
  }
}
