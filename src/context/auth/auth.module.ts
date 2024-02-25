import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './passport.jwt.strategy';
@Module({
  imports: [
    // JWT 모듈 등록
    JwtModule.register({
      secret: process.env.JWT_SECRET, // JWT Signature의 Secret 값 입력
      signOptions: { expiresIn: '1h' }, // JWT 토큰의 만료시간 입력
    }),
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
