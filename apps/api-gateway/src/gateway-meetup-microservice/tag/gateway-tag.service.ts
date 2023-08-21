import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagFrontend } from './types/tag.frontend';
import { firstValueFrom } from 'rxjs';
import { IReadAllTagOptions } from './types/read-all-tag.options';
import { ReadAllResult } from '@app/common';

@Injectable()
export class GatewayTagService {
  constructor(@Inject('GATEWAY_MEETUP_SERVICE') private readonly client: ClientProxy) {}

  async readAll(readAllTagOptions: IReadAllTagOptions): Promise<ReadAllResult<TagFrontend>> {
    const tags = await firstValueFrom(this.client.send('GET_ALL_TAGS', readAllTagOptions));
    return tags;
  }

  async readById(id: string): Promise<TagFrontend> {
    const tag = await firstValueFrom(this.client.send('GET_TAG_BY_ID', { id }));
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<TagFrontend> {
    const createdTag = await firstValueFrom(this.client.send('CREATE_TAG', createTagDto));
    return createdTag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<TagFrontend> {
    const updatedTag = await firstValueFrom(this.client.send('UPDATE_TAG_BY_ID', { id, updateTagDto }));
    return updatedTag;
  }

  async deleteById(id: string): Promise<void> {
    await this.client.emit('DELETE_TAG_BY_ID', { id });
  }
}
