import { TagEntity } from '../../tag/types';

export class MeetupUpdateAttrs {
  title?: string;
  description?: string;
  date?: string;
  place?: string;
  organizerId?: number;
  tags?: TagEntity[];
}
