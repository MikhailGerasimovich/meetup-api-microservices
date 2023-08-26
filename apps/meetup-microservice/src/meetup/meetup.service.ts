import { HttpStatus, Injectable } from '@nestjs/common';
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
import { RpcException } from '@nestjs/microservices';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

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

  async readById(id: number): Promise<Meetup> {
    const meetup = await this.meetupRepository.readById(id);
    return meetup;
  }

  async create(createMeetupDto: CreateMeetupDto, organizer: JwtPayloadDto): Promise<Meetup> {
    const tags = await this._createTagsIfNotExist(createMeetupDto.tags);

    const meetupCreationAttrs: MeetupCreationAttrs = {
      title: createMeetupDto.title,
      description: createMeetupDto.description,
      date: createMeetupDto.date,
      place: createMeetupDto.place,
      tags: tags,
      organizerId: organizer.id,
    };
    const createdMeetup = await this.meetupRepository.create(meetupCreationAttrs);
    return createdMeetup;
  }

  async joinToMeetup(meetupId: number, member: JwtPayloadDto): Promise<Meetup> {
    const isJoined = await this.meetupRepository.isJoined(meetupId, member.id);
    if (isJoined) {
      throw new RpcException({ message: `You are already joined for this meetup`, statusCode: HttpStatus.BAD_REQUEST });
    }

    const meetup = await this.meetupRepository.joinToMeetup(meetupId, member.id);
    return meetup;
  }

  async leaveFromMeetup(meetupId: number, member: JwtPayloadDto): Promise<Meetup> {
    const isJoined = await this.meetupRepository.isJoined(meetupId, member.id);
    if (!isJoined) {
      throw new RpcException({
        message: `You can't leave a meeting you're not in`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const meetup = await this.meetupRepository.leaveFromMeetup(meetupId, member.id);
    return meetup;
  }

  async update(id: number, updateMeetupDto: UpdateMeetupDto): Promise<Meetup> {
    const existingMeetup = await this.meetupRepository.readById(id);
    if (!existingMeetup) {
      throw new RpcException({ message: `The specified meetup does not exist`, statusCode: HttpStatus.BAD_REQUEST });
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

  async deleteById(id: number): Promise<void> {
    const existingMeetup = await this.meetupRepository.readById(id);
    if (!existingMeetup) {
      throw new RpcException({ message: `The specified meetup does not exist`, statusCode: HttpStatus.BAD_REQUEST });
    }

    await this.meetupRepository.deleteById(id);
  }

  private async _createTagsIfNotExist(tagsTitle: string[]): Promise<Tag[]> {
    const tags = [];
    for await (let title of tagsTitle) {
      const existingTag = await this.tagService.readByTitle(title);
      if (!existingTag) {
        tags.push(await this.tagService.create({ title: title }));
        continue;
      }
      tags.push(existingTag);
    }
    return tags;
  }
}
