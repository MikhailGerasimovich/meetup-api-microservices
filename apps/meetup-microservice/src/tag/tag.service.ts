import { HttpStatus, Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './types/tag.entity';
import { TagCreationAttrs } from './types/tag.creation-attrs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async readById(id: number): Promise<Tag> {
    const tag = await this.tagRepository.readById(id);
    return tag;
  }

  async readByTitle(title: string): Promise<Tag> {
    const tag = await this.tagRepository.readByTitle(title);
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tagCreationAttrs: TagCreationAttrs = {
      title: createTagDto.title,
    };
    const createdTag = await this.tagRepository.create(tagCreationAttrs);
    return createdTag;
  }

  async deleteById(id: number): Promise<void> {
    const existingTag = await this.tagRepository.readById(id);
    if (!existingTag) {
      throw new RpcException({ message: `The specified tag does not exist`, statusCode: HttpStatus.BAD_REQUEST });
    }

    await this.tagRepository.deleteById(id);
  }
}
