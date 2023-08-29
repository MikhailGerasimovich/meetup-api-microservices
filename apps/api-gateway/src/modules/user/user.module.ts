import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_MICROSERVICE } from '../../common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync({
      clients: [
        {
          name: AUTH_MICROSERVICE.RMQ_CLIENT_NAME,
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RMQ_URL_AUTH_MICROSERVICE')],
              queue: configService.get<string>('RMQ_QUEUE_AUTH_MICROSERVICE'),
              queueOptions: {
                durable: false,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
