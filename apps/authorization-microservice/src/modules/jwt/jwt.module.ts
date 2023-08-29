import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../../database/database.module';
import { JwtRepository } from './jwt.repository';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
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
