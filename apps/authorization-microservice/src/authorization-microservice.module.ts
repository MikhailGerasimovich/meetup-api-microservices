import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { MicroserviceAllExceptionsFilter } from '@app/common';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [UserModule, AuthModule, JwtModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MicroserviceAllExceptionsFilter,
    },
  ],
  controllers: [AuthController],
})
export class AuthorizationMicroserviceModule {}
