import { TagEntity } from '../../tag/types';

export class MeetupCreationAttrs {
  title: string;
  description: string;
  date: string;
  place: string;
  tags: TagEntity[];
  organizerId: number;
}
