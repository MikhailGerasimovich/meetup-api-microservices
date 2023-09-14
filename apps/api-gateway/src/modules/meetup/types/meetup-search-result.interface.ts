import { MeetupSearchBody } from './meetup-search-body.interface';

export interface MeetupSearchResult {
  hits: {
    total: number;
    hits: Array<{ _source: MeetupSearchBody }>;
  };
}
