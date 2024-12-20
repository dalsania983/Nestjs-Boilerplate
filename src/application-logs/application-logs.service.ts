import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import {
  exclude,
  getPagination,
  getSearchField,
} from 'src/common/helpers/db.helper';
import { CreateLogsDto, GetLogsByUserIdDto } from './application-logs.dto';

const prisma = new PrismaClient();

@Injectable()
export class ApplicationLogsService {
  constructor() {}
  async createLogs(createLogsDto: CreateLogsDto) {
    const log = await prisma.applicationLogs.create({
      data: createLogsDto as Prisma.ApplicationLogsUncheckedCreateInput,
    });

    if (!log) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: true,
          data: null,
          message: 'Not able to create application log.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      status: HttpStatus.CREATED,
      error: true,
      data: null,
      message: 'Application Log created successfully.',
    };
  }
  async getLogsByUserId(userId: string, query: GetLogsByUserIdDto) {
    const { page, pageSize, sort, sortBy, search } = query;

    const orderBy = {};
    if (sort && sortBy) {
      orderBy[sortBy] = sort;
    }

    const where = {
      user_id: userId,
      OR: getSearchField(
        ['first_name', 'last_name', 'email', 'phone_number'],
        search,
      ),
    };

    const { data, pagination } = await getPagination({
      page,
      pageSize,
      module: prisma.applicationLogs,
      args: {
        where,
        orderBy,
        select: exclude('ApplicationLogs', ['user_id', 'id', 'Users']),
      },
    });

    if (!data) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: true,
          data: [],
          message: 'Not able to get logs.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data,
      pagination,
      status: HttpStatus.OK,
      error: false,
      message: 'Logs fetched successfully.',
    };
  }
}
