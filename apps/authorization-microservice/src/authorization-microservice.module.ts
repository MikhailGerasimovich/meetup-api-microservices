import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule],
  providers: [],
  controllers: [AuthController],
})
export class AuthorizationMicroserviceModule {}
