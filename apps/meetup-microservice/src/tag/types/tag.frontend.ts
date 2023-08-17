import { Tag } from './tag.entity';

export class TagFrontend {
  id: number | string;
  title: string;

  constructor(tag: Tag) {
    this.id = tag?.id;
    this.title = tag?.title;
  }
}
