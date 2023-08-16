import { Meetup } from './meetup.entity';

export class MeetupFrontend {
  id: number | string;
  title: string;
  description: string;
  date: string;
  place: string;
  organiserId: string | number;
  tags?: {
    id?: number | string;
    title?: string;
  }[];

  constructor(meetup: Meetup) {
    this.id = meetup.id;
    this.title = meetup.title;
    this.description = meetup.description;
    this.date = meetup.date;
    this.place = meetup.place;
    this.organiserId = meetup.organizerId;
    this.tags = meetup?.tags?.map((tag) => ({
      id: tag.id,
      name: tag.title,
    }));
  }
}
