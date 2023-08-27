import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
import { MeetupMicroserviceModule } from './meetup-microservice.module';
import { MEETUP_MICROSERVICE } from './common';

config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MeetupMicroserviceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [MEETUP_MICROSERVICE.RMQ_URL],
      queue: MEETUP_MICROSERVICE.RMQ_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen();
}
bootstrap();
