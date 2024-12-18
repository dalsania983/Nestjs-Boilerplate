import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException({
        status: 401,
        error: true,
        message: 'Authentication failed. Please log in again.',
        data: null,
      });
    }
    return user;
  }
}
