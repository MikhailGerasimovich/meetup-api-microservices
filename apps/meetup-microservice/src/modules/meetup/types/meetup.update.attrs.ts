import { TagEntity } from '../../tag/types';

export class MeetupUpdateAttrs {
  title?: string;
  description?: string;
  date?: string;
  place?: string;
  latitude?: number;
  longitude?: number;
  organizerId?: number;
  tags?: TagEntity[];
}
