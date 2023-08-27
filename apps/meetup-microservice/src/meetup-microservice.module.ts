import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MicroserviceAllExceptionsFilter } from '@app/common';
import { TagModule } from './modules/tag/tag.module';
import { MeetupModule } from './modules/meetup/meetup.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [DatabaseModule, TagModule, MeetupModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MicroserviceAllExceptionsFilter,
    },
  ],
})
export class MeetupMicroserviceModule {}
