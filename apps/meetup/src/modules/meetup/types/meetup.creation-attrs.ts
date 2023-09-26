import { TagEntity } from '../../tag/types';

export class MeetupCreationAttrs {
  title: string;
  description: string;
  date: string;
  place: string;
  latitude: number;
  longitude: number;
  tags: TagEntity[];
  organizerId: number;
}
