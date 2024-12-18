import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './auth.dto';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async signIn(loginDto: LoginDto, ip) {
    try {
      const { email, password } = loginDto;
      const user = await this.validateUser(email, password);

      const token = await this.jwtService.sign({ userId: user.uuid });
      const ipAddress = ip || 'unknown';
      const tokenExpiration = new Date();
      tokenExpiration.setDate(tokenExpiration.getDate() + 1); // Token expires in 1 day

      await prisma.userToken.create({
        data: {
          token,
          user_id: user.uuid,
          ip_address: ipAddress,
          token_ex: tokenExpiration,
        },
      });
      return {
        status: HttpStatus.OK,
        error: false,
        data: { access_token: token, user_id: user.uuid },
        message: 'You Successfully logged in.',
      };
    } catch (error) {
      console.log('error', error);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: true,
          data: null,
          message: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async validateUser(email: string, password: string) {
    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: true,
          data: null,
          message: 'Invalid credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: true,
          data: null,
          message: 'Invalid credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
  async logout(token: string) {
    try {
      await prisma.userToken.deleteMany({ where: { token } });
      return {
        status: HttpStatus.OK,
        error: false,
        data: null,
        message: 'You Successfully logged out.',
      };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: true,
          data: null,
          message: 'User Instance not found.',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
