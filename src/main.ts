import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import helmet from 'helmet';
import * as requestIp from 'request-ip';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as session from 'express-session';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as http from 'http';

async function bootstrap() {
  dotenv.config();
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  // MiddleWares
  app.use(requestIp.mw());
  app.use(bodyParser.text());
  app.use(helmet());
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
    }),
  );

  // Global Interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: 'http://localhost:3000', // Front URL
  });

  await app.listen(4000);

  const httpServer = http.createServer(app.getHttpAdapter().getInstance());
  httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
  });
}
bootstrap();
