// payload.interface.ts
import { SWYP_UserLoginType } from '@prisma/client';

export interface Payload {
  // user_id: number;
  user_email: string;
  user_nickname: string;
  user_login_type: SWYP_UserLoginType;
}
