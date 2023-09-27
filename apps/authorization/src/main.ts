import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthorizationMicroserviceModule } from './authorization.module';

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthorizationMicroserviceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RMQ_URL_AUTH_MICROSERVICE')],
      queue: configService.get<string>('RMQ_QUEUE_AUTH_MICROSERVICE'),
      noAck: true,
      persistent: true,
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.listen();
}

bootstrap();
