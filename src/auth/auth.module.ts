import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import configuration from 'config/configuration';

// const config = configuration();
@Module({
  imports: [
    JwtModule.register({
      secret: 'test',
      // secret: config.JWT_SECRET,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
