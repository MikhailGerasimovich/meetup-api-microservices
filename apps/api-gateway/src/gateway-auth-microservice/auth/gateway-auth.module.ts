import { Module } from '@nestjs/common';
import { GatewayAuthService } from './gateway-auth.service';
import { GatewayAuthController } from './gateway-auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_MICROSERVICE } from '../../constants/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_MICROSERVICE.RMQ_CLIENT_NAME,
        transport: Transport.RMQ,
        options: {
          urls: [AUTH_MICROSERVICE.RMQ_URL],
          queue: AUTH_MICROSERVICE.RMQ_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [GatewayAuthService, LocalStrategy, JwtStrategy],
  controllers: [GatewayAuthController],
  exports: [GatewayAuthService],
})
export class GatewayAuthModule {}
