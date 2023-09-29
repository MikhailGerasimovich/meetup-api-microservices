import { ApiProperty } from '@nestjs/swagger';
import { defaultPagination } from '../default.pagination';

export class PaginationDto {
  @ApiProperty({
    name: 'pagination[page]',
    description: 'Number of pages',
    minimum: 1,
    default: defaultPagination.page,
    required: false,
  })
  page: number;

  @ApiProperty({
    name: 'pagination[size]',
    description: 'Number of entries per page',
    minimum: 1,
    maximum: 100,
    default: defaultPagination.size,
    required: false,
  })
  size: number;
}
