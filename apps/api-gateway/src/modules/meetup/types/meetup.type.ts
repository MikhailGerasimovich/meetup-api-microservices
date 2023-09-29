import { ApiProperty } from '@nestjs/swagger';
import { MeetupEntity } from './meetup.entity';

class TagType {
  @ApiProperty({ description: 'Tag identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Tag title', example: 1 })
  title: string;
}

export class MeetupType {
  @ApiProperty({ description: 'Meetup identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Meetup title', example: 'meetup' })
  title: string;

  @ApiProperty({ description: 'Meetup description', example: 'Meetup description' })
  description: string;

  @ApiProperty({ description: 'Meetup date', example: '12-12-2022 12:12:12' })
  date: string;

  @ApiProperty({ description: 'Meetup place', example: 'Modsen office' })
  place: string;

  @ApiProperty({ description: 'Meetup latitude coordinate', example: 48.850923 })
  latitude: number;

  @ApiProperty({ description: 'Meetup longitude coordinate', example: 2.308697 })
  longitude: number;

  @ApiProperty({ description: 'Meetup organizer id', example: 2 })
  organiserId: number;

  @ApiProperty({
    description: 'Meetup tags',
    example: [
      { id: 1, title: 'js' },
      { id: 2, title: 'nestjs' },
    ],
    type: TagType,
  })
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
    this.latitude = meetup?.latitude;
    this.longitude = meetup?.longitude;
    this.organiserId = meetup?.organizerId;
    this.tags = meetup?.tags?.map((obj) => ({
      id: obj.tag.id,
      title: obj.tag.title,
    }));
  }
}
