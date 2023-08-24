import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayMeetupService } from './gateway-meetup.service';
import { GatewayMeetupController } from './gateway-meetup.controller';
import { MEETUP_MICROSERVICE } from '../../constants/constants';

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
  providers: [GatewayMeetupService],
  controllers: [GatewayMeetupController],
})
export class GatewayMeetupModule {}
