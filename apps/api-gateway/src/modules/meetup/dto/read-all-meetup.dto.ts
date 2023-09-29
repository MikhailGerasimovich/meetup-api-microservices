import { BaseReadAllDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';

export class ReadAllMeetupDto extends BaseReadAllDto {
  @ApiProperty({ description: 'Meetup title', example: 'Company meetup', required: false })
  title?: string;

  @ApiProperty({ description: 'Meetup description', example: 'Meeting topic: web programming', required: false })
  description?: string;

  @ApiProperty({ description: 'Meetup date', example: '08-10-2023 12:00:00', required: false })
  date?: string;

  @ApiProperty({
    description: 'Meetup addres description',
    example: 'Vitebsk city, Bogdan Khmelnitsky street 30',
    required: false,
  })
  place?: string;

  @ApiProperty({
    description: 'Meetup geoposition coordinates',
    example: { latitude: 55.184649, longitude: 30.206938 },
    required: false,
  })
  geoposition?: {
    latitude: number;
    longitude: number;
  };

  @ApiProperty({ description: 'Meetup tags', example: ['NodeJS', 'Express', 'NestJS'], required: false })
  tags: string[];

  @ApiProperty({ description: 'Meetup organizer id', example: 2, required: false })
  organizerId: number;
}
