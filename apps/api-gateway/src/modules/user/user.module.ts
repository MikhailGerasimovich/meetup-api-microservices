import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_MICROSERVICE, JWT } from '../../common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

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
      secret: JWT.ACCESS_SECRET,
      signOptions: { expiresIn: JWT.ACCESS_DURATION },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
