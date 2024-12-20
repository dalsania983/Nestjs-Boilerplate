import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Ip,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto, GetAllUsersDto } from './users.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

type T = any;
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
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

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() req: Request,
    @Res() res: Response,
    @Ip() ip,
  ) {
    try {
      const { user_id }: T = req.user;
      const result = await this.usersService.createUser(
        createUserDto,
        ip,
        user_id,
      );
      if (result.error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
      }
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res
        .status(error.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error.', error });
    }
  }
}
