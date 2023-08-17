import { PaginationDto } from '../pagination/dto/pagination.dto';
import { SortingDto } from '../sorting/dto/sorting.dto';

export class BaseReadAllDto {
  pagination: PaginationDto;
  sorting: SortingDto;
}
