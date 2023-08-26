import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Tag } from './types/tag.entity';
import { TagCreationAttrs } from './types/tag.creation-attrs';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readById(id: number): Promise<Tag> {
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

  async create(tagCreationAttrs: TagCreationAttrs): Promise<Tag> {
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
