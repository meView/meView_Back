import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AnswerModule } from './answer/answer.module';
import { MeviewModule } from './meview/meview.module';

@Module({
  imports: [AccountModule, AuthModule, UsersModule, AnswerModule, MeviewModule],
})
export class ContextModule {}
