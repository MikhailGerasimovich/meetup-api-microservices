import { Module } from '@nestjs/common';
import { GatewayMeetupMicroserviceModule } from './gateway-meetup-microservice/gateway-meetup-microservice.module';

@Module({
  imports: [GatewayMeetupMicroserviceModule],
})
export class ApiGatewayModule {}
