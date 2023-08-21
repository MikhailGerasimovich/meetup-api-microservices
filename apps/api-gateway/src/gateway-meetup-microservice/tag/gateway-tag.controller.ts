import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Delete } from '@nestjs/common';
import { GatewayTagService } from './gateway-tag.service';
import { JoiValidationPipe, ReadAllResult } from '@app/common';
import { ReadAllTagSchema } from './schemas/read-all-tag.schema';
import { ReadAllTagDto } from './dto/read-all-tag.dto';
import { TagFrontend } from './types/tag.frontend';
import { CreateTagSchema } from './schemas/create-tag.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { UpdateTagSchema } from './schemas/update-tag.schema';

@Controller('tag')
export class GatewayTagController {
  constructor(private readonly gatewayTagService: GatewayTagService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async readAll(
    @Query(new JoiValidationPipe(ReadAllTagSchema)) readAllTagDto: ReadAllTagDto,
  ): Promise<ReadAllResult<TagFrontend>> {
    const { pagination, sorting, ...filters } = readAllTagDto;
    const tags = await this.gatewayTagService.readAll({ pagination, sorting, filters });
    return tags;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id') id: string): Promise<TagFrontend> {
    const tag = await this.gatewayTagService.readById(id);
    return tag;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new JoiValidationPipe(CreateTagSchema)) createTagDto: CreateTagDto): Promise<TagFrontend> {
    const createdTag = await this.gatewayTagService.create(createTagDto);
    return createdTag;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateTagSchema)) updateTagDto: UpdateTagDto,
  ): Promise<TagFrontend> {
    const updatedTag = await this.gatewayTagService.update(id, updateTagDto);
    return updatedTag;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string): Promise<any> {
    await this.gatewayTagService.deleteById(id);
  }
}
