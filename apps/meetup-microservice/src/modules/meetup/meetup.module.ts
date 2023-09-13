import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TagModule } from '../tag/tag.module';
import { MeetupRepository } from './meetup.repository';
import { MeetupService } from './meetup.service';
import { MeetupController } from './meetup.controller';
import { MeetupSearchModule } from '../search/meetup-search.module';

@Module({
  imports: [DatabaseModule, TagModule, MeetupSearchModule],
  providers: [MeetupRepository, MeetupService],
  controllers: [MeetupController],
  exports: [MeetupService],
})
export class MeetupModule {}
