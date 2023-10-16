import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MicroserviceAllExceptionsFilter } from '@app/common';
import { JwtModule } from './modules/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

const DefineConfigModule = ConfigModule.forRoot({
  envFilePath: './apps/authorization/.envDocker',
  isGlobal: true,
  cache: true,
});

@Module({
  imports: [DefineConfigModule, UserModule, AuthModule, JwtModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MicroserviceAllExceptionsFilter,
    },
  ],
})
export class AuthorizationMicroserviceModule {}
