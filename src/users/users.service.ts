import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import {
  exclude,
  getPagination,
  getSearchField,
} from 'src/common/helpers/db.helper';
import { CreateUserDto, GetAllUsersDto } from './users.dto';

const prisma = new PrismaClient();
@Injectable()
export class UsersService {
  async getUsers(getAllUsersDto: GetAllUsersDto) {
    const { page, pageSize, search } = getAllUsersDto;
    const { data, pagination } = await getPagination({
      page,
      pageSize,
      module: prisma.users,
      args: {
        select: exclude('Users', ['password', 'id', 'UserToken']),
        where: {
          OR: getSearchField(
            ['first_name', 'last_name', 'email', 'phone_number'],
            search,
          ),
        },
      },
    });

    if (!data) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: true,
          data: [],
          message: 'Not able to get users list.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (data && data.length <= 0) {
      return {
        pagination,
        status: HttpStatus.NOT_FOUND,
        error: false,
        data: [],
        message: 'Users not found.',
      };
    }
    return {
      data,
      pagination,
      status: HttpStatus.OK,
      error: false,
      message: 'Users fetch successfully.',
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const { phone_number, email, password } = createUserDto;

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ phone_number }, { email }],
      },
    });

    if (existingUser) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: false,
        data: null,
        message: 'User already exist in system.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { ...createUserDto, password: hashedPassword },
      select: exclude('Users', ['id', 'password', 'UserToken']),
    });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: true,
          data: [],
          message: 'Not able to create User.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      status: HttpStatus.CREATED,
      error: false,
      data: user,
      message: 'Users created successfully.',
    };
  }
}
