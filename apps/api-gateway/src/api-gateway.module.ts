import { Module } from '@nestjs/common';
import { GatewayMeetupMicroserviceModule } from './gateway-meetup-microservice/gateway-meetup-microservice.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@app/common';
import { GatewayAuthMicroserviceModule } from './gateway-auth-microservice/gateway-auth-microservice.module';

@Module({
  imports: [GatewayMeetupMicroserviceModule, GatewayAuthMicroserviceModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class ApiGatewayModule {}
