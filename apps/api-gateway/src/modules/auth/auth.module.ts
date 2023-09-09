import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy, LocalStrategy, RefreshStrategy, YandexStrategy } from './strategies';

@Module({
  imports: [ConfigModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy, YandexStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
