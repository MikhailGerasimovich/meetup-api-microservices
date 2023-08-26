import { Tag } from '../../tag/types/tag.entity';

export class MeetupUpdateAttrs {
  title?: string;
  description?: string;
  date?: string;
  place?: string;
  organizerId?: number;
  tags?: Tag[];
}
