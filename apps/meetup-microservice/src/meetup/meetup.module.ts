import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MeetupRepository } from './meetup.repository';
import { MeetupService } from './meetup.service';

@Module({
  imports: [DatabaseModule],
  providers: [MeetupRepository, MeetupService],
  controllers: [],
  exports: [MeetupService],
})
export class MeetupModule {}
