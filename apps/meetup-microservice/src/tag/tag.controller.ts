import { Controller, Get, HttpCode, HttpStatus, Param, Body, Post, Put, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { JoiValidationPipe } from '@app/common';
import { CreateTagSchema } from './schemas/create-tag.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagSchema } from './schemas/update-tag.schema';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagFrontend } from './types/tag.frontend';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async readAll(): Promise<TagFrontend[]> {
    const tags = await this.tagService.readAll();
    return tags.map((tag) => new TagFrontend(tag));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id') id: string): Promise<TagFrontend> {
    const tag = await this.tagService.readById(id);
    return new TagFrontend(tag);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new JoiValidationPipe(CreateTagSchema)) createTagDto: CreateTagDto): Promise<TagFrontend> {
    const createdTag = await this.tagService.create(createTagDto);
    return new TagFrontend(createdTag);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateTagSchema)) updateTagDto: UpdateTagDto,
  ): Promise<TagFrontend> {
    const updatedTag = await this.tagService.update(id, updateTagDto);
    return new TagFrontend(updatedTag);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.tagService.deleteById(id);
  }
}
