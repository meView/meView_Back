// passport.jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Payload } from './payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // true 설정 시, 토큰이 만료되어도 에러를 리턴하지 않는다.
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    const user = await this.authService.tokenValidateUser(payload);
    console.log(user);
    if (!user) {
      return done(
        new UnauthorizedException({ message: 'user does not exist' }),
        false,
      );
    }
    return done(null, user);
  }
}
