import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MEETUP_MICROSERVICE } from '../../common';
import { MeetupService } from './meetup.service';
import { MeetupController } from './meetup.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MEETUP_MICROSERVICE.RMQ_CLIENT_NAME,
        transport: Transport.RMQ,
        options: {
          urls: [MEETUP_MICROSERVICE.RMQ_URL],
          queue: MEETUP_MICROSERVICE.RMQ_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [MeetupService],
  controllers: [MeetupController],
})
export class MeetupModule {}
