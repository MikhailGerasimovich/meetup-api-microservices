import { IPaginationOptions, ISortingOptions } from '@app/common';

export interface IReadAllUserOptions {
  filters?: {
    login?: string;
    email?: string;
  };
  pagination?: IPaginationOptions;
  sorting?: ISortingOptions;
}
