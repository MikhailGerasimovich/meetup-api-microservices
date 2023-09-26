import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TransactionClient } from '../../common';
import { TagRepository } from './tag.repository';
import { TagEntity, TagCreationAttrs } from './types';
import { CreateTagDto } from './dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async readById(id: number, transaction?: TransactionClient): Promise<TagEntity> {
    const tag = await this.tagRepository.readById(id, transaction);
    return tag;
  }

  async readByTitle(title: string, transaction?: TransactionClient): Promise<TagEntity> {
    const tag = await this.tagRepository.readByTitle(title, transaction);
    return tag;
  }

  async create(createTagDto: CreateTagDto, transaction?: TransactionClient): Promise<TagEntity> {
    const tagCreationAttrs: TagCreationAttrs = {
      title: createTagDto.title,
    };

    const createdTag = await this.tagRepository.create(tagCreationAttrs, transaction);
    return createdTag;
  }

  async isRelated(id: number, transaction?: TransactionClient): Promise<boolean> {
    return await this.tagRepository.isRelated(id, transaction);
  }

  async deleteById(id: number, transaction?: TransactionClient): Promise<void> {
    const existingTag = await this.tagRepository.readById(id, transaction);
    if (!existingTag) {
      throw new RpcException({ message: `The specified tag does not exist`, statusCode: HttpStatus.BAD_REQUEST });
    }

    await this.tagRepository.deleteById(id, transaction);
  }
}
