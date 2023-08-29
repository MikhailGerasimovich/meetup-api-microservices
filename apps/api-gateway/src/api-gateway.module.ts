import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AllExceptionsFilter } from '@app/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MeetupModule } from './modules/meetup/meetup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/api-gateway/.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configServie: ConfigService) => ({
        secret: configServie.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configServie.get<string>('JWT_ACCESS_DURATION'),
        },
      }),
      inject: [ConfigService],
    }),

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
