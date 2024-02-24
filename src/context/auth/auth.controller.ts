import { AuthService } from './auth.service';
import {
  Controller,
  Get,
  Query,
  Res,
  Req,
  Session,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
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
    // accessToken 발급
    const { accessToken, refreshToken } =
      await this.authService.getKakaoAccessToken(
        code,
        error,
        error_description,
      );

    // jwtToken 받기
    const { jwtToken, payload } = await this.authService.getKakaoUserInfo(
      accessToken,
    );

    // UserInfo 저장
    await this.authService.saveUserInfo(payload);

    // jwtToken 저장
    res.setHeader('Authorization', 'Bearer ' + jwtToken);
    return res.send(jwtToken);
  }

  @Get('kakao_logout')
  async executeKakaoLogout(@Res() res: Response) {
    const response = await this.authService.executeKakaoLogout();

    // TODO: 로그아웃 구현
    return res.redirect('http://localhost:3000/home');
  }

  // TODO: 가드(AuthGuard) 추가하기
  @Get('/authenticate')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req: Request): any {
    return;
  }

  @Get('test')
  async test(@Req() req: Request) {
    return;
  }
}
