import { AuthService } from './auth.service';
import { Controller, Get, Query, Res, Req, Session } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao_login')
  async executeKakaoLogin(
    @Query('code') code: string,
    @Query('error') error: string,
    @Query('error_description') error_description: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      // accessToken 발급
      const { accessToken, refreshToken } =
        await this.authService.getAccessToken(code, error, error_description);

      // jwtToken 받기
      const jwtToken = await this.authService.getUserInfo(accessToken);

      // TODO: DB 에 user 정보 저장 함수 구현 예정
      await this.authService.saveUserInfo();

      res.setHeader('Authorization', 'Bearer ' + jwtToken);
      return res.send(jwtToken);
    } catch (error) {
      console.error('executeKakaoLogin Error: ', error.message);

      // TODO: 로그인 실패할 경우 행동 처리
      return res.redirect('http://localhost:3000/NotFound');
    }
  }

  @Get('kakao_logout')
  async executeKakaoLogout(@Res() res: Response) {
    const response = await this.authService.executeKakaoLogout();

    // TODO: 로그아웃 구현
    return res.redirect('http://localhost:3000/home');
  }
}
