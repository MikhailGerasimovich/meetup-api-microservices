import { getSchemaPath } from '@nestjs/swagger';
import { MeetupType } from '../../modules/meetup/types';

export const getAllMeetupSchemaOptions = {
  properties: {
    totalRecordsNumber: { type: 'number', example: 1 },
    records: {
      type: 'array',
      items: { $ref: getSchemaPath(MeetupType) },
    },
  },
};
