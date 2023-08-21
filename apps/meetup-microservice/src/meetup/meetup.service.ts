import { BadRequestException, Injectable } from '@nestjs/common';
import { MeetupRepository } from './meetup.repository';
import { Meetup } from './types/meetup.entity';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { MeetupCreationAttrs } from './types/meetup.creation-attrs';
import { TagService } from '../tag/tag.service';
import { Tag } from '../tag/types/tag.entity';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { MeetupUpdateAttrs } from './types/meetup.update.attrs';
import { IReadAllMeetupOptions } from './types/read-all-meetup.options';
import { ReadAllResult } from '@app/common';

@Injectable()
export class MeetupService {
  constructor(
    private readonly meetupRepository: MeetupRepository,
    private readonly tagService: TagService,
  ) {}

  async readAll(readAllOptions: IReadAllMeetupOptions): Promise<ReadAllResult<Meetup>> {
    const readAllMeetups = await this.meetupRepository.readAll(readAllOptions);
    return readAllMeetups;
  }

  async readById(id: string): Promise<Meetup> {
    const meetup = await this.meetupRepository.readById(id);
    return meetup;
  }

  async create(createMeetupDto: CreateMeetupDto): Promise<Meetup> {
    const tags = await this._createTagsIfNotExist(createMeetupDto.tags);

    const meetupCreationAttrs: MeetupCreationAttrs = {
      title: createMeetupDto.title,
      description: createMeetupDto.description,
      date: createMeetupDto.date,
      place: createMeetupDto.place,
      tags: tags,
      organizerId: 1, //test data
    };
    const createdMeetup = await this.meetupRepository.create(meetupCreationAttrs);
    return createdMeetup;
  }

  async update(id: string, updateMeetupDto: UpdateMeetupDto): Promise<Meetup> {
    const existingMeetup = await this.meetupRepository.readById(id);
    if (!existingMeetup) {
      throw new BadRequestException(`The specified meetup does not exist`);
    }

    const tags = updateMeetupDto.tags ? await this._createTagsIfNotExist(updateMeetupDto.tags) : null;

    const meetupUpdateAttrs: MeetupUpdateAttrs = {
      title: updateMeetupDto.title || existingMeetup.title,
      description: updateMeetupDto.description || existingMeetup.description,
      date: updateMeetupDto.date || existingMeetup.date,
      place: updateMeetupDto.place || existingMeetup.place,
      tags: tags,
      organizerId: 1, //test data
    };

    const updatedMeetup = await this.meetupRepository.update(id, meetupUpdateAttrs);
    return updatedMeetup;
  }

  async deleteById(id: string): Promise<void> {
    const existingMeetup = await this.meetupRepository.readById(id);
    if (!existingMeetup) {
      throw new BadRequestException(`The specified meetup does not exist`);
    }

    await this.meetupRepository.deleteById(id);
  }

  private async _createTagsIfNotExist(tagsTitle: string[]): Promise<Tag[]> {
    const tags = [];
    for await (let title of tagsTitle) {
      const existingTag = await this.tagService.getByTitle(title);
      if (!existingTag) {
        tags.push(await this.tagService.create({ title: title }));
        continue;
      }
      tags.push(existingTag);
    }
    return tags;
  }
}
