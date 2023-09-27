import { Injectable } from '@nestjs/common';
import { TransactionClient } from '../../common';
import { TagRepository } from './tag.repository';
import { TagEntity } from './types';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async readMany(titles: string[], transaction: TransactionClient): Promise<TagEntity[]> {
    return await this.tagRepository.readMany(titles, transaction);
  }

  async createMany(titles: string[], transaction?: TransactionClient): Promise<void> {
    await this.tagRepository.createMany(titles, transaction);
  }

  async getRelatedTags(tags: TagEntity[], transaction?: TransactionClient): Promise<TagEntity[]> {
    return await this.tagRepository.getRelatedTags(tags, transaction);
  }

  async deleteMany(tags: TagEntity[], transaction?: TransactionClient): Promise<void> {
    await this.tagRepository.deleteMany(tags, transaction);
  }
}
