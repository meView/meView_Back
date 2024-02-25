import { PrismaClient, SWYP_UserLoginType } from '@prisma/client';

export class UserDto {
  user_id: number;
  user_email: string;
  user_nickname: string;
  user_login_type: SWYP_UserLoginType;
}
