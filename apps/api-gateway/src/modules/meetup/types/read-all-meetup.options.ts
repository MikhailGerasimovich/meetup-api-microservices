import { IPaginationOptions, ISortingOptions } from '@app/common';

export interface IReadAllMeetupOptions {
  filters?: {
    title?: string;
    description?: string;
    date?: string;
    place?: string;
    geoposition?: {
      latitude: number;
      longitude: number;
    };
    tags: string[];
    organizerId: number | string;
  };
  pagination?: IPaginationOptions;
  sorting?: ISortingOptions;
}
