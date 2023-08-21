import { Module } from '@nestjs/common';
import { GatewayTagModule } from './tag/gateway-tag.module';
import { GatewayMeetupModule } from './meetup/gateway-meetup.module';

@Module({
  imports: [GatewayTagModule, GatewayMeetupModule],
})
export class GatewayMeetupMicroserviceModule {}
