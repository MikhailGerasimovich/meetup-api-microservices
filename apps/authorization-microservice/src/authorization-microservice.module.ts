import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [],
  controllers: [AuthController],
})
export class AuthorizationMicroserviceModule {}
