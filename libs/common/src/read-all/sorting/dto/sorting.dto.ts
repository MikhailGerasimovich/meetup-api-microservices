import { ApiProperty } from '@nestjs/swagger';
import { defaultSorting } from '../default.sorting';

export class SortingDto {
  @ApiProperty({
    name: 'sorting[column]',
    description: 'The name of the property to sort',
    default: defaultSorting.column,
    required: false,
  })
  column: string;

  @ApiProperty({
    name: 'sorting[direction]',
    description: 'Sorting direction',
    enum: ['desc', 'asc'],
    default: defaultSorting.direction,
    required: false,
  })
  direction: 'desc' | 'asc';
}
