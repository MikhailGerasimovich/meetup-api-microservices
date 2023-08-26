import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JWT } from '../constants/constants';
import { JwtRepository } from './jwt.repository';
import { JwtService } from './jwt.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    NestJwtModule.register({
      secret: JWT.REFRESH_SECRET,
      signOptions: { expiresIn: JWT.ACCESS_DURATION },
    }),
  ],
  providers: [JwtRepository, JwtService],
  exports: [JwtService],
})
export class JwtModule {}
