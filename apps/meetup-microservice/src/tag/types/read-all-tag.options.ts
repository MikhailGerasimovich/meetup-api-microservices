import { IPaginationOptions, ISortingOptions } from '@app/common';

export interface IReadAllTagOptions {
  filters?: {
    title?: string;
  };
  pagination?: IPaginationOptions;
  sorting?: ISortingOptions;
}
