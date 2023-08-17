import { BadRequestException, Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './types/tag.entity';
import { TagCreationAttrs } from './types/tag.creation-attrs';
import { TagUpdateAttrs } from './types/tag.update-attrs';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async readAll(): Promise<Tag[]> {
    const tags = await this.tagRepository.readAll();
    return tags;
  }

  async readById(id: string): Promise<Tag> {
    const tag = await this.tagRepository.readById(id);
    return tag;
  }

  async getByTitle(title: string): Promise<Tag> {
    const tag = await this.tagRepository.getByTitle(title);
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tagCreationAttrs: TagCreationAttrs = {
      title: createTagDto.title,
    };
    const createdTag = await this.tagRepository.create(tagCreationAttrs);
    return createdTag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const existingTag = await this.tagRepository.readById(id);
    if (!existingTag) {
      throw new BadRequestException(`The specified tag does not exist`);
    }

    const tagUpdateAttrs: TagUpdateAttrs = {
      title: updateTagDto.title || existingTag.title,
    };

    const updatedTag = await this.tagRepository.update(id, tagUpdateAttrs);
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
