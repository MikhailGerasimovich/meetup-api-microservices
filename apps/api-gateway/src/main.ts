import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { config } from 'dotenv';
import { APPLICATION } from './constants/application.constants';

config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  await app.listen(APPLICATION.PORT);
}

bootstrap();
