import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MEETUP_MICROSERVICE } from '../../common';
import { MeetupService } from './meetup.service';
import { MeetupController } from './meetup.controller';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync({
      clients: [
        {
          name: MEETUP_MICROSERVICE.RMQ_CLIENT_NAME,
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RMQ_URL_MEETUP_MICROSERVICE')],
              queue: configService.get<string>('RMQ_QUEUE_MEETUP_MICROSERVICE'),
              queueOptions: {
                durable: true,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  providers: [MeetupService],
  controllers: [MeetupController],
})
export class MeetupModule {}
