import { Injectable } from '@nestjs/common';
import { PrismaClient, Tags } from '@prisma/client';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async readAll(): Promise<Tags[]> {
    const tags = await this.prisma.tags.findMany();
    return tags;
  }

  async readById(id: string): Promise<Tags> {
    const tag = await this.prisma.tags.findUnique({
      where: { id: Number(id) },
    });
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<Tags> {
    const createdTag = await this.prisma.tags.create({
      data: createTagDto,
    });
    return createdTag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tags> {
    const updatedTag = await this.prisma.tags.update({
      where: { id: Number(id) },
      data: updateTagDto,
    });
    return updatedTag;
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.tags.delete({
      where: { id: Number(id) },
    });
  }
}
