import { Injectable } from '@nestjs/common';
import { TagEntity, TagCreationAttrs } from './types';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readById(id: number): Promise<TagEntity> {
    const tag = await this.prisma.tags.findUnique({
      where: { id },
    });
    return tag;
  }

  async readByTitle(title: string) {
    const tag = await this.prisma.tags.findUnique({
      where: { title },
    });
    return tag;
  }

  async create(tagCreationAttrs: TagCreationAttrs): Promise<TagEntity> {
    const createdTag = await this.prisma.tags.create({
      data: {
        title: tagCreationAttrs.title,
      },
    });
    return createdTag;
  }

  async isRelated(id: number): Promise<boolean> {
    const count = await this.prisma.meetupsToTags.count({
      where: {
        tagId: id,
      },
    });

    return count ? true : false;
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.tags.delete({
      where: { id },
    });
  }
}
