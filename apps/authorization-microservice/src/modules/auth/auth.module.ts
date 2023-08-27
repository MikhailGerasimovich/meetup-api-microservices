import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [DatabaseModule, UserModule, JwtModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
