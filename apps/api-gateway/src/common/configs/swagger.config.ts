import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('MEETUP-API')
  .setDescription('Microservice web api for working with meetups')
  .setVersion('1.0')
  .addCookieAuth('cookie', { type: 'apiKey', in: 'cookie', name: 'auth-cookie' })
  .build();
