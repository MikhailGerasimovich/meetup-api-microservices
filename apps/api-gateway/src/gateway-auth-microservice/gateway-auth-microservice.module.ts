import { Module } from '@nestjs/common';
import { GatewayAuthModule } from './auth/gateway-auth.module';
import { GatewayUserModule } from './user/gateway-user.module';

@Module({
  imports: [GatewayAuthModule, GatewayUserModule],
})
export class GatewayAuthMicroserviceModule {}
