import { PrismaClient, SWYP_UserLoginType } from '@prisma/client';

export class CreateUserDto {
  // user_id?: number | null;
  user_email: string;
  user_nickname: string;
  user_login_type: SWYP_UserLoginType;
}
