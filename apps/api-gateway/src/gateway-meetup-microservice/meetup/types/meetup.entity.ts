import { Tag } from '../../tag/types/tag.entity';

export class Meetup {
  id: number | string;
  title: string;
  description: string;
  date: string;
  place: string;
  tags?: { tag: Tag }[];
  organizerId: number | string;
}
