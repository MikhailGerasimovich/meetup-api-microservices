import { BadRequestException, Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { Tags } from '@prisma/client';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async readAll(): Promise<Tags[]> {
    const tags = await this.tagRepository.readAll();
    return tags;
  }

  async readById(id: string): Promise<Tags> {
    const tag = await this.tagRepository.readById(id);
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<Tags> {
    const createdTag = await this.tagRepository.create(createTagDto);
    return createdTag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tags> {
    const existingTag = await this.tagRepository.readById(id);
    if (!existingTag) {
      throw new BadRequestException(`The specified tag does not exist`);
    }

    const updatedTag = await this.tagRepository.update(id, updateTagDto);
    return updatedTag;
  }

  async deleteById(id: string): Promise<void> {
    const existingTag = await this.tagRepository.readById(id);
    if (!existingTag) {
      throw new BadRequestException(`The specified tag does not exist`);
    }

    await this.tagRepository.deleteById(id);
  }
}
