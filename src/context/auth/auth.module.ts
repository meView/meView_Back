import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // JWT 모듈 등록
    JwtModule.register({
      secret: process.env.JWT_SECRET, // JWT Signature의 Secret 값 입력
      signOptions: { expiresIn: '1h' }, // JWT 토큰의 만료시간 입력
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
