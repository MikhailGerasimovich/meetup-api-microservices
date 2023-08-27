class TagEntity {
  id: number;
  title: string;
}

export class MeetupEntity {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  tags?: { tag: TagEntity }[];
  organizerId: number;
}
