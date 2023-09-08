import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_MICROSERVICE } from '../../common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy, LocalStrategy, RefreshStrategy, YandexStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync({
      clients: [
        {
          name: AUTH_MICROSERVICE.RMQ_CLIENT_NAME,
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RMQ_URL_AUTH_MICROSERVICE')],
              queue: configService.get<string>('RMQ_QUEUE_AUTH_MICROSERVICE'),
              queueOptions: {
                durable: true,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy, YandexStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
