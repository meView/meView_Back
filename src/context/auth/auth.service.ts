import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import axios from 'axios';
import { Payload } from './payload.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private PrismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getAccessToken(code: string, error: string, error_description: string) {
    try {
      if (error || error_description) {
        throw new Error(
          'getAccessToken Error from kakao: ' + error_description,
        );
      }
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: process.env.REST_API_KEY,
          redirect_uri: process.env.REDIRECT_URI,
          code: code,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('getAccessToken Error: ', error);
      throw new Error('getAccessToken Error: ' + error);
    }
  }

  async getUserInfo(accessToken: string) {
    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // TODO: email 등 유저 정보 추가 예정
      const payload: Payload = {
        user_id: response.data.id,
        user_nickname: response.data.kakao_account.profile.nickname,
      };

      const jwtToken = this.jwtService.sign(payload);

      return jwtToken;
    } catch (error) {
      console.error('getUserInfo Error: ', error);
      throw new Error('getUserInfo Error: ' + error);
    }
  }

  async saveUserInfo() {
    // TODO: 유저 정보 저장
    return;
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
      console.error('executeKakaoLogout Error: ', error);
      throw new Error('executeKakaoLogin Error: ' + error);
    }
  }
}
