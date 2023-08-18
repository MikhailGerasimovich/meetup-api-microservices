import { Module } from '@nestjs/common';
import { TagModule } from './tag/tag.module';
import { MeetupModule } from './meetup/meetup.module';
import { AllExceptionsFilter } from '@app/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [TagModule, MeetupModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class MeetupMicroserviceModule {}
