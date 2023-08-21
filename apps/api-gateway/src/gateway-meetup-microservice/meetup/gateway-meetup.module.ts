import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayMeetupService } from './gateway-meetup.service';
import { GatewayMeetupController } from './gateway-meetup.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GATEWAY_MEETUP_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'meetup_microservice_queue',
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
