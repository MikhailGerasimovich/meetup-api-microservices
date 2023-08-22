import { Module } from '@nestjs/common';
import { TagModule } from './tag/tag.module';
import { MeetupModule } from './meetup/meetup.module';
import { AllExceptionsFilter } from '@app/common';
import { APP_FILTER } from '@nestjs/core';
import { MicroserviceAllExceptionsFilter } from '@app/common/filters/microservice-all-exception.filter';

@Module({
  imports: [TagModule, MeetupModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MicroserviceAllExceptionsFilter,
    },
  ],
})
export class MeetupMicroserviceModule {}
