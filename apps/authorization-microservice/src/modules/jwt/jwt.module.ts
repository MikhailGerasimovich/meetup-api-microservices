import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../../database/database.module';
import { JwtRepository } from './jwt.repository';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    NestJwtModule.registerAsync({
      useFactory: async (configServie: ConfigService) => ({
        secret: configServie.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configServie.get<string>('JWT_ACCESS_DURATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtRepository, JwtService],
  exports: [JwtService],
})
export class JwtModule {}
