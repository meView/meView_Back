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
import * as https from 'https';
import * as fs from 'fs';

async function bootstrap() {
  dotenv.config();
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  const privateKey = fs.readFileSync(
    '/etc/letsencrypt/live/meview.store/privkey.pem',
  );
  const certificate = fs.readFileSync(
    '/etc/letsencrypt/live/meview.store/cert.pem',
  );
  const ca = fs.readFileSync(
    '/etc/letsencrypt/live/meview.store/fullchain.pem',
  );
  const httpsOptions = { key: privateKey, cert: certificate, ca: ca };

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
    origin: process.env.DEPLOY_FRONT_URL, // Front URL
  });

  await app.listen(4000);

  const httpServer = http.createServer(app.getHttpAdapter().getInstance());
  httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
  });
  const httpsServer = https.createServer(
    httpsOptions,
    app.getHttpAdapter().getInstance(),
  );
  httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
}
bootstrap();
