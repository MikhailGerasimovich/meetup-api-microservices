import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [DatabaseModule, JwtModule],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
