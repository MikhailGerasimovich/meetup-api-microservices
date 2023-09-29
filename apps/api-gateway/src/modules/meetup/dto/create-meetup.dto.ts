import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetupDto {
  @ApiProperty({ description: 'Meetup title', example: 'Company meetup', required: true, nullable: false })
  title: string;

  @ApiProperty({ description: 'Meetup description', example: 'Meeting topic: web programming', required: true, nullable: false })
  description: string;

  @ApiProperty({ description: 'Meetup date', example: '08-10-2023 12:00:00', required: true, nullable: false })
  date: string;

  @ApiProperty({
    description: 'Meetup addres description',
    example: 'Vitebsk city, Bogdan Khmelnitsky street 30',
    required: true,
    nullable: false,
  })
  place: string;

  @ApiProperty({ description: 'Meetup latitude coordinate', example: 55.184649, required: true, nullable: false })
  latitude: number;

  @ApiProperty({ description: 'Meetup longitude coordinate', example: 30.206938, required: true, nullable: false })
  longitude: number;

  @ApiProperty({ description: 'Meetup tags', example: ['NodeJS', 'Express', 'NestJS'], required: true, nullable: false })
  tags: string[];
}
