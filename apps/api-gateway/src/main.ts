import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { APPLICATION } from './constants/constants';

config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.use(cookieParser());
  await app.listen(APPLICATION.PORT);
}

bootstrap();
