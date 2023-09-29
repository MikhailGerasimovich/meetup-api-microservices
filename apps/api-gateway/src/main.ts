import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApiGatewayModule);

  const configService = new ConfigService();
  const port = configService.get<number>('PORT');

  app.use(cookieParser());
  app.setBaseViewsDir('./apps/api-gateway/src/modules/meetup/report-templates');

  app.setViewEngine('ejs');
  SwaggerModule.setup('doc', app, SwaggerModule.createDocument(app, swaggerConfig));
  app.enableCors();

  await app.listen(port);
}

bootstrap();
