import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Tag } from './types/tag.entity';
import { TagCreationAttrs } from './types/tag.creation-attrs';
import { TagUpdateAttrs } from './types/tag.update-attrs';
import { IReadAllTagOptions } from './types/read-all-tag.options';
import { defaultPagination, defaultSorting, offset } from '@app/common';
import { getTagFilters } from './filters/read-all-tag.filter';
import { ReadAllResult } from '@app/common/read-all/pagination/types/read-all.type';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readAll(readAllOptions: IReadAllTagOptions): Promise<ReadAllResult<Tag>> {
    const page = readAllOptions?.pagination?.page || defaultPagination.page;
    const size = readAllOptions?.pagination?.size || defaultPagination.size;

    const column = readAllOptions?.sorting?.column ?? defaultSorting.column;
    const direction = readAllOptions?.sorting?.direction ?? defaultSorting.direction;

    const filters = getTagFilters(readAllOptions?.filters);

    const records = await this.prisma.tags.findMany({
      where: { ...filters.tagFilters },
      skip: offset(page, size),
      take: Number(size),
      orderBy: {
        [column]: direction,
      },
    });

    const totalRecordsNumber = await this.prisma.tags.count({ where: { ...filters.tagFilters } });

    return { totalRecordsNumber, records };
  }

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

  async update(id: number, tagUpdateAttrs: TagUpdateAttrs): Promise<Tag> {
    const updatedTag = await this.prisma.tags.update({
      where: { id },
      data: {
        title: tagUpdateAttrs.title,
      },
    });
    return updatedTag;
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.tags.delete({
      where: { id },
    });
  }
}
