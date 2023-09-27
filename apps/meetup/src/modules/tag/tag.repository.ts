import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TransactionClient } from '../../common';
import { TagEntity } from './types';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readMany(titles: string[], transaction: TransactionClient): Promise<TagEntity[]> {
    const executer = transaction ? transaction : this.prisma;
    const tags = await executer.tags.findMany({
      where: { OR: titles.map((title) => ({ title })) },
    });
    return tags;
  }

  async createMany(titles: string[], transaction?: TransactionClient): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.tags.createMany({
      data: titles.map((title) => ({ title })),
      skipDuplicates: true,
    });
  }

  async getRelatedTags(tags: TagEntity[], transaction?: TransactionClient): Promise<TagEntity[]> {
    const executer = transaction ? transaction : this.prisma;
    const relatedTags = await executer.tags.findMany({
      where: {
        meetups: {
          some: { OR: tags.map((tag) => ({ tagId: tag.id })) },
        },
      },
    });
    return relatedTags;
  }

  async deleteMany(tags: TagEntity[], transaction?: TransactionClient): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.tags.deleteMany({
      where: { OR: tags.map((tag) => ({ id: tag.id })) },
    });
  }
}
