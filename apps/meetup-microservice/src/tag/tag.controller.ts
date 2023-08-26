import { Controller, ParseIntPipe } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagFrontend } from './types/tag.frontend';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ReadAllResult } from '@app/common';
import { IReadAllTagOptions } from './types/read-all-tag.options';
import { METADATA } from '../constants/constants';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @MessagePattern(METADATA.MP_GET_ALL_TAGS)
  async readAll(@Payload() readAllTagOptions: IReadAllTagOptions): Promise<ReadAllResult<TagFrontend>> {
    const tags = await this.tagService.readAll(readAllTagOptions);
    return {
      totalRecordsNumber: tags.totalRecordsNumber,
      records: tags.records.map((tag) => new TagFrontend(tag)),
    };
  }

  @MessagePattern(METADATA.MP_GET_TAG_BY_ID)
  async readById(@Payload('id', ParseIntPipe) id: number): Promise<TagFrontend> {
    const tag = await this.tagService.readById(id);
    return new TagFrontend(tag);
  }

  @MessagePattern(METADATA.MP_CREATE_TAG)
  async create(@Payload() createTagDto: CreateTagDto): Promise<TagFrontend> {
    const createdTag = await this.tagService.create(createTagDto);
    return new TagFrontend(createdTag);
  }

  @MessagePattern(METADATA.MP_UPDATE_TAG_BY_ID)
  async update(
    @Payload('id', ParseIntPipe) id: number,
    @Payload('updateTagDto') updateTagDto: UpdateTagDto,
  ): Promise<TagFrontend> {
    const updatedTag = await this.tagService.update(id, updateTagDto);
    return new TagFrontend(updatedTag);
  }

  @EventPattern(METADATA.EP_DELETE_TAG_BY_ID)
  async deleteById(@Payload('id', ParseIntPipe) id: number): Promise<void> {
    await this.tagService.deleteById(id);
  }
}
