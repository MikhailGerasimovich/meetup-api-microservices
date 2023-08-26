import { Module } from '@nestjs/common';
import { GatewayMeetupModule } from './meetup/gateway-meetup.module';

@Module({
  imports: [GatewayMeetupModule],
})
export class GatewayMeetupMicroserviceModule {}
