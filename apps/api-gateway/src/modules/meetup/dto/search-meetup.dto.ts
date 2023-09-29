import { ApiProperty } from '@nestjs/swagger';

export class SearchMeetupDto {
  @ApiProperty({ description: 'Option for full text search', example: 'Meeting topic: web programming', required: true })
  text: string;
}
