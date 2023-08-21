import { Module } from '@nestjs/common';
import { GatewayMeetupMicroserviceModule } from './gateway-meetup-microservice/gateway-meetup.module';

@Module({
  imports: [GatewayMeetupMicroserviceModule],
})
export class ApiGatewayModule {}
