import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { SortingDto } from '../sorting/dto/sorting.dto';

export class BaseReadAllDto {
  @ApiProperty({ required: false })
  pagination: PaginationDto;

  @ApiProperty({ required: false })
  sorting: SortingDto;
}
