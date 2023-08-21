import { Controller } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagFrontend } from './types/tag.frontend';
import { ReadAllTagDto } from './dto/read-all-tag.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ReadAllResult } from '@app/common';
import { IReadAllTagOptions } from './types/read-all-tag.options';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @MessagePattern('GET_ALL_TAGS')
  async readAll(@Payload() readAllTagOptions: IReadAllTagOptions): Promise<ReadAllResult<TagFrontend>> {
    const tags = await this.tagService.readAll(readAllTagOptions);
    return {
      totalRecordsNumber: tags.totalRecordsNumber,
      records: tags.records.map((tag) => new TagFrontend(tag)),
    };
  }

  @MessagePattern('GET_TAG_BY_ID')
  async readById(@Payload('id') id: string): Promise<TagFrontend> {
    const tag = await this.tagService.readById(id);
    return new TagFrontend(tag);
  }

  @MessagePattern('CREATE_TAG')
  async create(@Payload() createTagDto: CreateTagDto): Promise<TagFrontend> {
    const createdTag = await this.tagService.create(createTagDto);
    return new TagFrontend(createdTag);
  }

  @MessagePattern('UPDATE_TAG')
  async update(@Payload('id') id: string, @Payload('updateTagDto') updateTagDto: UpdateTagDto): Promise<TagFrontend> {
    const updatedTag = await this.tagService.update(id, updateTagDto);
    return new TagFrontend(updatedTag);
  }

  @EventPattern('DELETE_TAG_BY_ID')
  async deleteById(@Payload('id') id: string): Promise<void> {
    await this.tagService.deleteById(id);
  }
}
