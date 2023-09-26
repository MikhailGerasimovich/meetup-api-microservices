import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TransactionClient } from '../../common';
import { TagEntity, TagCreationAttrs } from './types';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readById(id: number, transaction?: TransactionClient): Promise<TagEntity> {
    const executer = transaction ? transaction : this.prisma;
    const tag = await executer.tags.findUnique({
      where: { id },
    });
    return tag;
  }

  async readByTitle(title: string, transaction?: TransactionClient) {
    const executer = transaction ? transaction : this.prisma;
    const tag = await executer.tags.findUnique({
      where: { title },
    });
    return tag;
  }

  async create(tagCreationAttrs: TagCreationAttrs, transaction?: TransactionClient): Promise<TagEntity> {
    const executer = transaction ? transaction : this.prisma;
    const createdTag = await executer.tags.create({
      data: {
        title: tagCreationAttrs.title,
      },
    });
    return createdTag;
  }

  async isRelated(id: number, transaction?: TransactionClient): Promise<boolean> {
    const executer = transaction ? transaction : this.prisma;
    const count = await executer.meetupsToTags.count({
      where: {
        tagId: id,
      },
    });

    return count ? true : false;
  }

  async deleteById(id: number, transaction?: TransactionClient): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.tags.delete({
      where: { id },
    });
  }
}
