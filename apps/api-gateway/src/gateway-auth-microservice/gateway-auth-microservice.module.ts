import { Module } from '@nestjs/common';
import { GatewayAuthModule } from './auth/gateway-auth.module';

@Module({
  imports: [GatewayAuthModule],
})
export class GatewayAuthMicroserviceModule {}
