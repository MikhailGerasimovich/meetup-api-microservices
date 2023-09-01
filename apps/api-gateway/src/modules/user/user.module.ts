import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_MICROSERVICE } from '../../common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AwsModule } from '../aws/aws.module';
import { AwsOptions } from '../aws/types';

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

    AwsModule.registerAsync({
      useFactory: (configService: ConfigService): AwsOptions => ({
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
        Bucket: configService.get<string>('AWS_BUCKET_NAME'),
        debug: true,
        route: configService.get<string>('AWS_ROUTE_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
