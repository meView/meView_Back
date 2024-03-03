import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ParseBooleanPipe } from 'src/app.pipe';

@Controller('/account/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('test') test(@Query('withError', ParseBooleanPipe) withError?: boolean) {
    const data = process.env.ENV_VERSION;
    return data;
  }

  @Get('refresh-token')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    if (!refreshToken) return;

    const { accessToken, refreshToken: newRefreshToken } =
      await this.usersService.refreshToken(refreshToken);

    return { accessToken, refreshToken };
  }
}
