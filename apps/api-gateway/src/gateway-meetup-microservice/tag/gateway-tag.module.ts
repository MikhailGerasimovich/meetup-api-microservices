import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayTagController } from './gateway-tag.controller';
import { GatewayTagService } from './gateway-tag.service';

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
  providers: [GatewayTagService],
  controllers: [GatewayTagController],
})
export class GatewayTagModule {}
