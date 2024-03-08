import { HttpException, Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { PrismaClient, SWYP_UserLoginType } from '@prisma/client';
import axios from 'axios';
import { Payload } from './payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private PrismaService: PrismaService,
    private jwtService: JwtService,
    private UsersService: UsersService,
  ) {}

  async getKakaoAccessToken(
    @Req() req: Request,
    code: string,
    error: string,
    error_description: string,
  ) {
    try {
      let redirectUri = process.env.KAKAO_LOCAL_REDIRECT_URI;
      if (
        req.headers.origin &&
        req.headers.origin === process.env.FRONT_DEPLOY_PATH
      ) {
        redirectUri = process.env.KAKAO_REDIRECT_URI;
      }

      if (error || error_description) {
        throw new Error(
          'getAccessToken Error from kakao: ' + error_description,
        );
      }
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: redirectUri,
          code: code,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
    } catch (error) {
      console.error('getAccessToken Error: ', error);
      throw new HttpException('Forbidden', 403);
    }
  }

  async getKakaoUserInfo(accessToken: string) {
    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // TODO: email 등 유저 정보 수정 & payload interface 수정 & create-user-dto 수정
      const payload: Payload = {
        // user_id: response.data.id,
        user_email: response.data.kakao_account.email,
        user_nickname: response.data.kakao_account.profile.nickname,
        user_login_type: SWYP_UserLoginType.KAKAO,
      };
      console.log("payload : ", payload)
      const jwtToken = this.jwtService.sign(payload);
      console.log("jwtToken : ", jwtToken)
      return { jwtToken, payload };
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  // TODO: 함수 구현
  async getGoogleAccessToken(
    @Req() req: Request,
    code: string,
    error: string,
    error_description: string,
  ) {
    try {
      let redirectUri = process.env.GOOGLE_LOCAL_REDIRECT_URI;
      if (
        req.headers.origin &&
        req.headers.origin === process.env.FRONT_DEPLOY_PATH
      ) {
        redirectUri = process.env.GOOGLE_REDIRECT_URI;
      }

      if (error || error_description) {
        throw new Error(
          'getAccessToken Error from kakao: ' + error_description,
        );
      }

      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code: code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return { accessToken: response.data.access_token, refreshToken: null };
    } catch (error) {
      console.error('getAccessToken Error: ', error);
      throw new HttpException('Forbidden', 403);
    }
  }

  async getGoogleUserInfo(accessToken: string) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/userinfo/v2/me?access_token=${accessToken}`,
      );

      // TODO: 구글에서 제공 -> name & given_name 어떤 걸 사용
      const payload: Payload = {
        // user_id: response.data.id,
        user_email: response.data.email,
        user_nickname: response.data.name,
        user_login_type: SWYP_UserLoginType.GOOGLE,
      };

      const jwtToken = this.jwtService.sign(payload);

      return { jwtToken, payload };
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async saveUserInfo(payload: Payload) {
    try {
      const response = await this.UsersService.create(payload);

      return response;
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async tokenValidateUser(payload: Payload): Promise<UserDto | undefined> {
    try {
      const user = await this.UsersService.findByEmail({
        user_email: payload.user_email,
      });

      if (!user) {
        throw new HttpException('Unauthorized', 401);
      }

      const userKeys = Object.keys(user);
      const payloadKeys = Object.keys(payload);

      const commonKeys = userKeys.filter((key) => payloadKeys.includes(key));

      for (const key of commonKeys) {
        if (user[key] !== payload[key]) {
          throw new HttpException('Unauthorized', 401);
        }
      }

      return user;
    } catch (error) {
      throw new HttpException('Unauthorized', 401);
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new HttpException('Unauthorized', 401);
    }
  }

  async executeKakaoLogout() {
    try {
      // TODO: 구현 예정
      // await axios.post(
      //   'https://kapi.kakao.com/v1/user/logout',
      //   {},
      //   {
      //     headers: {
      //       Authorization: `Bearer ${access_token}`,
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //   },
      // );
      return;
    } catch (error) {
      throw new Error('executeKakaoLogin Error: ' + error);
    }
  }
}
