import { AuthService } from './auth.service';
import { Controller, Get, Query, Res, Req, UseGuards } from '@nestjs/common';
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
        req,
        code,
        error,
        error_description,
      );
    console.log("GET kakao_login accessToken : ", accessToken)
    // jwtToken 발급
    const { jwtToken, payload } = await this.authService.getKakaoUserInfo(
      accessToken,
    );
    console.log("GET kakao_login jwtToken : ", jwtToken)
    // UserInfo 저장
    const userInfo = await this.authService.saveUserInfo(payload);
    console.log("GET kakao_login userInfo : ", userInfo)

    // jwtToken 저장
    res.setHeader('Authorization', 'Bearer ' + jwtToken);
    return res.json({
      success: true,
      code: 'OK',
      data: {
        user: userInfo,
        jwtToken,
      },
      statusCode: 200,
    });
  }

  @Get('google_login')
  async executeGoogleLogin(
    @Query('code') code: string,
    @Query('error') error: string,
    @Query('error_description') error_description: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // accessToken 발급
    const { accessToken, refreshToken } =
      await this.authService.getGoogleAccessToken(
        req,
        code,
        error,
        error_description,
      );

    // jwtToken 발급
    const { jwtToken, payload } = await this.authService.getGoogleUserInfo(
      accessToken,
    );

    // UserInfo 저장
    const userInfo = await this.authService.saveUserInfo(payload);

    // jwtToken 저장
    res.setHeader('Authorization', 'Bearer ' + jwtToken);
    return res.json({
      success: true,
      code: 'OK',
      data: {
        user: userInfo,
        jwtToken,
      },
      statusCode: 200,
    });
  }

  // TODO: 로그아웃 구현
  @Get('kakao_logout')
  async executeKakaoLogout(@Res() res: Response) {
    const response = await this.authService.executeKakaoLogout();
    return res.redirect('http://localhost:3000/home');
  }

  // TODO: 가드(AuthGuard) 추가하기
  @Get('/authenticate')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req: Request): any {
    return;
  }

  @Get('test')
  @UseGuards(AuthGuard)
  async test(@Req() req: Request) {
    console.log(req.user);
    return;
  }
}
