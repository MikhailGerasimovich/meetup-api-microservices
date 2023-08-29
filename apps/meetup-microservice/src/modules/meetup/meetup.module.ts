import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TagModule } from '../tag/tag.module';
import { MeetupRepository } from './meetup.repository';
import { MeetupService } from './meetup.service';
import { MeetupController } from './meetup.controller';

@Module({
  imports: [DatabaseModule, TagModule],
  providers: [MeetupRepository, MeetupService],
  controllers: [MeetupController],
  exports: [MeetupService],
})
export class MeetupModule {}
