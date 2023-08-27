import { MeetupEntity } from './meetup.entity';

export class MeetupType {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  organiserId: number;
  tags?: {
    id?: number;
    title?: string;
  }[];

  constructor(meetup: MeetupEntity) {
    this.id = meetup?.id;
    this.title = meetup?.title;
    this.description = meetup?.description;
    this.date = meetup?.date;
    this.place = meetup?.place;
    this.organiserId = meetup?.organizerId;
    this.tags = meetup?.tags?.map((obj) => ({
      id: obj.tag.id,
      title: obj.tag.title,
    }));
  }
}
