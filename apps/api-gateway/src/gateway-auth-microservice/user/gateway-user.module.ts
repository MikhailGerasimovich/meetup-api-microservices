import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { GatewayUserService } from './gateway-user.service';
import { GatewayUserController } from './gateway-user.controller';
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
  providers: [JwtStrategy, GatewayUserService],
  controllers: [GatewayUserController],
  exports: [],
})
export class GatewayUserModule {}
