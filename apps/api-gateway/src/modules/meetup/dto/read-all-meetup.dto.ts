import { BaseReadAllDto } from '@app/common';

export class ReadAllMeetupDto extends BaseReadAllDto {
  title?: string;
  description?: string;
  date?: string;
  place?: string;
  geoposition?: {
    latitude: number;
    longitude: number;
  };
  tags: string[];
  organizerId: number;
}
