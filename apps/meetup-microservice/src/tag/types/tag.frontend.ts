import { Tag } from './tag.entity';

export class TagFroontend {
  id: number | string;
  title: string;

  constructor(tag: Tag) {
    this.id = tag.id;
    this.title = tag.title;
  }
}
