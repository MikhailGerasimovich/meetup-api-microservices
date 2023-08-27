import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { ApiGatewayModule } from './api-gateway.module';
import { APPLICATION } from './common';

config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.use(cookieParser());
  await app.listen(APPLICATION.PORT);
}

bootstrap();
