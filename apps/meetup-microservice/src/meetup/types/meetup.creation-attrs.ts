import { Tag } from '../../tag/types/tag.entity';

export class MeetupCreationAttrs {
  title: string;
  description: string;
  date: string;
  place: string;
  tags: Tag[];
  organizerId: number;
}
