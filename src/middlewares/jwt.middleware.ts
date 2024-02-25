// jwt.middleware.ts
// 사용하지 않는 파일입니다. possport.jwt.startegy.ts 에서 해당 역할을 맡습니다.
import {
  HttpException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../context/auth/auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Header 에서 token 추출
      const token = await this.extractTokenFromHeader(req);

      if (!token) {
        throw new Error();
      }

      // token verify & token decode
      const decodedPayload = await this.authService.verifyToken(token);

      // payload.user_email 이용해서 user info 가져오기
      const foundUserInfo = await this.authService.tokenValidateUser(
        decodedPayload,
      );

      // payload 에 담긴 정보와 db 에서 가져온 정보가 같은지 확인
      await this.compareCommonValues(decodedPayload, foundUserInfo);

      req.user = decodedPayload;
      next();
    } catch (error) {
      console.error('Error validating token:', error.message);
      throw new HttpException('Unauthorized', 401);
    }
  }

  private async extractTokenFromHeader(req: Request): Promise<string | null> {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.substring(7);
    }

    return null;
  }

  private async compareCommonValues(
    obj1: object,
    obj2: object,
  ): Promise<boolean> {
    try {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      const commonKeys = keys1.filter((key) => keys2.includes(key));

      for (const key of commonKeys) {
        if (obj1[key] !== obj2[key]) {
          throw new UnauthorizedException('Invalid payload');
        }
      }

      return true;
    } catch (error) {
      throw new HttpException('compareCommonValues Error', 401);
    }
  }
}
