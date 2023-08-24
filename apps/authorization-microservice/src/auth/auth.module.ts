import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { JWT } from '../constants/constants';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    JwtModule.register({
      secret: JWT.REFRESH_SECRET,
      signOptions: { expiresIn: JWT.ACCESS_DURATION },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
