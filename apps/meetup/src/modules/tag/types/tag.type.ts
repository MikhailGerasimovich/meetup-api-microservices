import { TagEntity } from './tag.entity';

export class TagType {
  id: number;
  title: string;

  constructor(tag: TagEntity) {
    this.id = tag?.id;
    this.title = tag?.title;
  }
}
