import { IPaginationOptions, ISortingOptions } from '@app/common';

export interface IReadAllUserOptions {
  filters?: {
    username?: string;
    email?: string;
  };
  pagination?: IPaginationOptions;
  sorting?: ISortingOptions;
}
