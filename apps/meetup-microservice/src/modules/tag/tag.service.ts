import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TagRepository } from './tag.repository';
import { TagEntity, TagCreationAttrs } from './types';
import { CreateTagDto } from './dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async readById(id: number): Promise<TagEntity> {
    const tag = await this.tagRepository.readById(id);
    return tag;
  }

  async readByTitle(title: string): Promise<TagEntity> {
    const tag = await this.tagRepository.readByTitle(title);
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<TagEntity> {
    const tagCreationAttrs: TagCreationAttrs = {
      title: createTagDto.title,
    };

    const createdTag = await this.tagRepository.create(tagCreationAttrs);
    return createdTag;
  }

  async isRelated(id: number): Promise<boolean> {
    return await this.tagRepository.isRelated(id);
  }

  async deleteById(id: number): Promise<void> {
    const existingTag = await this.tagRepository.readById(id);
    if (!existingTag) {
      throw new RpcException({ message: `The specified tag does not exist`, statusCode: HttpStatus.BAD_REQUEST });
    }

    await this.tagRepository.deleteById(id);
  }
}
