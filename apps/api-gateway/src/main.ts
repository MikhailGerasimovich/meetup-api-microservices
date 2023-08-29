import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = new ConfigService();
  const port = configService.get<number>('PORT');

  app.use(cookieParser());
  await app.listen(port);
}

bootstrap();
