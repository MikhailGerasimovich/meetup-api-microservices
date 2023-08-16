import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { JoiValidationPipe } from '@app/common';
import { CreateTagSchema } from './schemas/create-tag.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagSchema } from './schemas/update-tag.schema';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagFroontend } from './types/tag.frontend';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async readAll(): Promise<TagFroontend[]> {
    const tags = await this.tagService.readAll();
    return tags.map((tag) => new TagFroontend(tag));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id') id: string): Promise<TagFroontend> {
    const tag = await this.tagService.readById(id);
    return new TagFroontend(tag);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new JoiValidationPipe(CreateTagSchema)) createTagDto: CreateTagDto,
  ): Promise<TagFroontend> {
    const createdTag = await this.tagService.create(createTagDto);
    return new TagFroontend(createdTag);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateTagSchema)) updateTagDto: UpdateTagDto,
  ): Promise<TagFroontend> {
    const updatedTag = await this.tagService.update(id, updateTagDto);
    return new TagFroontend(updatedTag);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.tagService.deleteById(id);
  }
}
