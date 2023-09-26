export interface MeetupSearchBody {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  latitude: number;
  longitude: number;
  tags: {
    id: number;
    title: string;
  }[];
}
