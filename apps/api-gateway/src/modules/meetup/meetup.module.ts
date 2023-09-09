import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MeetupService } from './meetup.service';
import { MeetupController } from './meetup.controller';

@Module({
  imports: [ConfigModule],
  providers: [MeetupService],
  controllers: [MeetupController],
})
export class MeetupModule {}
