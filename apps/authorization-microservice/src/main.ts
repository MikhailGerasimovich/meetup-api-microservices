import { NestFactory } from '@nestjs/core';
import * as coocieParser from 'cookie-parser';
import { AuthorizationMicroserviceModule } from './authorization-microservice.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthorizationMicroserviceModule);
  app.use(coocieParser());
  await app.listen(3000);
}
bootstrap();

/*async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthorizationMicroserviceModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'auth_microservice_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
}*/
