import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBModule } from './db/db.module';
import { ContextModule } from './context/context.module';
import { InjectAccountMiddleware } from './middlewares/InjectAccount.middleware';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import { AuthModule } from './context/auth/auth.module';
import { AnswerModule } from './context/answer/answer.module';

@Module({
  imports: [DBModule, ContextModule, AuthModule, AnswerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InjectAccountMiddleware).forRoutes();
    // jwt middleware 대신 passport.jwt.strategy 사용
    // consumer.apply(JwtMiddleware).forRoutes('/auth/test', '/users');
  }
}
