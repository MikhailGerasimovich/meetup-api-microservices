import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Tag } from './types/tag.entity';
import { TagCreationAttrs } from './types/tag.creation-attrs';
import { TagUpdateAttrs } from './types/tag.update-attrs';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readAll(): Promise<Tag[]> {
    const tags = await this.prisma.tags.findMany();
    return tags;
  }

  async readById(id: string): Promise<Tag> {
    const tag = await this.prisma.tags.findUnique({
      where: { id: Number(id) },
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

  async update(id: string, tagUpdateAttrs: TagUpdateAttrs): Promise<Tag> {
    const updatedTag = await this.prisma.tags.update({
      where: { id: Number(id) },
      data: {
        title: tagUpdateAttrs.title,
      },
    });
    return updatedTag;
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.tags.delete({
      where: { id: Number(id) },
    });
  }
}
