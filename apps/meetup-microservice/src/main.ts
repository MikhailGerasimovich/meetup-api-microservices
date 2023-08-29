import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
import { MeetupMicroserviceModule } from './meetup-microservice.module';
import { MEETUP_MICROSERVICE } from './common';
import { ConfigService } from '@nestjs/config';

config();

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MeetupMicroserviceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RMQ_URL_MEETUP_MICROSERVICE')],
      queue: configService.get<string>('RMQ_QUEUE_MEETUP_MICROSERVICE'),
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen();
}
bootstrap();
