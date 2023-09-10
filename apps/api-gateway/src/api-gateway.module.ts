import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AllExceptionsFilter } from '@app/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MeetupModule } from './modules/meetup/meetup.module';
import { AUTH, MEETUP } from './common';

const DefineConfigModule = ConfigModule.forRoot({
  envFilePath: './apps/api-gateway/.env',
  isGlobal: true,
});

const DefineClientModule = ClientsModule.registerAsync({
  clients: [
    {
      name: AUTH.RMQ_CLIENT_NAME,
      useFactory: async (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('RMQ_URL_AUTH_MICROSERVICE')],
          queue: configService.get<string>('RMQ_QUEUE_AUTH_MICROSERVICE'),
          queueOptions: {
            durable: true,
          },
          noAck: true,
          persistent: true,
        },
      }),
      inject: [ConfigService],
    },
    {
      name: MEETUP.RMQ_CLIENT_NAME,
      useFactory: async (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('RMQ_URL_MEETUP_MICROSERVICE')],
          queue: configService.get<string>('RMQ_QUEUE_MEETUP_MICROSERVICE'),
          queueOptions: {
            durable: true,
          },
          noAck: true,
          persistent: true,
        },
      }),
      inject: [ConfigService],
    },
  ],
  isGlobal: true,
});

const DefineJwtModule = JwtModule.registerAsync({
  global: true,
  useFactory: async (configServie: ConfigService) => ({
    secret: configServie.get<string>('JWT_ACCESS_SECRET'),
    signOptions: {
      expiresIn: configServie.get<string>('JWT_ACCESS_DURATION'),
    },
  }),
  inject: [ConfigService],
});

@Module({
  imports: [
    DefineConfigModule,
    DefineClientModule,
    DefineJwtModule,
    PassportModule,
    AuthModule,
    UserModule,
    MeetupModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class ApiGatewayModule {}
