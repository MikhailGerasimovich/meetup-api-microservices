import { Module } from '@nestjs/common';
import { MeetupRepository } from './meetup.repository';
import { MeetupService } from './meetup.service';
import { MeetupController } from './meetup.controller';
import { TagModule } from '../tag/tag.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, TagModule],
  providers: [MeetupRepository, MeetupService],
  controllers: [MeetupController],
  exports: [MeetupService],
})
export class MeetupModule {}
