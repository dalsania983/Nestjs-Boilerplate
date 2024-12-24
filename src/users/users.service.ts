import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import {
  exclude,
  getPagination,
  getSearchField,
} from 'src/common/helpers/db.helper';
import { CreateUserDto, GetAllUsersDto } from './users.dto';
import { ApplicationLogsService } from 'src/application-logs/application-logs.service';
import { LogAction, LogModal } from 'src/common/constants/logs.constants';

const prisma = new PrismaClient();
type T = any;
@Injectable()
export class UsersService {
  constructor(private applicationLogs: ApplicationLogsService) {}
  async getUsers(getAllUsersDto: GetAllUsersDto) {
    try {
      const { page, pageSize, search, sort, sortBy } = getAllUsersDto;

      const orderBy = {};
      if (sort && sortBy) {
        orderBy[sortBy] = sort;
      }

      const { data, pagination } = await getPagination({
        page,
        pageSize,
        module: prisma.users,
        args: {
          orderBy,
          select: exclude('Users', [
            'password',
            'id',
            'UserToken',
            'ApplicationLogs',
          ]),
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
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: true,
          data: [],
          message: 'Internal Server error.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(
    createUserDto: CreateUserDto,
    ip: string,
    requesterId: string,
  ) {
    try {
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
      const user: { [x: string]: T } = await prisma.users.create({
        data: { ...createUserDto, password: hashedPassword },
        select: exclude('Users', [
          'id',
          'password',
          'UserToken',
          'ApplicationLogs',
        ]),
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
      this.applicationLogs.createLogs({
        user_id: requesterId,
        action: LogAction.CREATE_USER,
        ip,
        message: `New User Signed Up Successfully: ${user.first_name} ${user.last_name}`,
        module: LogModal.USER,
      });
      return {
        status: HttpStatus.CREATED,
        error: false,
        data: user,
        message: 'Users created successfully.',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error?.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
          error: true,
          data: null,
          message: error?.response?.message ?? 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
