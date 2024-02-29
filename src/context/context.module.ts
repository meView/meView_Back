import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AnswerModule } from './answer/answer.module';
import { MeviewModule } from './meview/meview.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformChipIdInterceptor } from 'src/interceptors/transformchipid.interceptor';
import { QuestionModule } from './question/question.module';
import { CapabilityModule } from './meview/capability/capability.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    AccountModule,
    AuthModule,
    UsersModule,
    AnswerModule,
    MeviewModule,
    QuestionModule,
    HomeModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformChipIdInterceptor,
    },
  ],
})
export class ContextModule {}
