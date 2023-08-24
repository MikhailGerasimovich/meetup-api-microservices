import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayTagController } from './gateway-tag.controller';
import { GatewayTagService } from './gateway-tag.service';
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
  providers: [GatewayTagService],
  controllers: [GatewayTagController],
})
export class GatewayTagModule {}
