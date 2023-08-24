import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { config } from 'dotenv';
import { APPLICATION } from './constants/application.constants';
import * as cookieParser from 'cookie-parser';

config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.use(cookieParser());
  await app.listen(APPLICATION.PORT);
}

bootstrap();
