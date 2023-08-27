import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
