export interface MeetupSearchBody {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  tags: {
    id: number;
    title: string;
  }[];
}
