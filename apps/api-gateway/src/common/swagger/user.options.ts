import { getSchemaPath } from '@nestjs/swagger';
import { UserType } from '../../modules/user/types';

export const getAllUserSchemaOptions = {
  properties: {
    totalRecordsNumber: { type: 'number', example: 1 },
    records: {
      type: 'array',
      items: { $ref: getSchemaPath(UserType) },
    },
  },
};
