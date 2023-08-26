import { Tag } from './tag.entity';

export class TagFrontend {
  id: number;
  title: string;

  constructor(tag: Tag) {
    this.id = tag?.id;
    this.title = tag?.title;
  }
}
