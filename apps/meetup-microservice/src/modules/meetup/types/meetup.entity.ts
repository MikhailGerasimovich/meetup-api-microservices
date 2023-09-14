import { TagEntity } from '../../tag/types';

export class MeetupEntity {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  latitude: number;
  longitude: number;
  tags?: { tag: TagEntity }[];
  organizerId: number;
}
