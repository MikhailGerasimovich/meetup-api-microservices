import { BaseReadAllDto } from '@app/common';

export class ReadAllMeetupDto extends BaseReadAllDto {
  title?: string;
  description?: string;
  date?: string;
  place?: string;
  tags: string[];
  organizerId: number;
}
