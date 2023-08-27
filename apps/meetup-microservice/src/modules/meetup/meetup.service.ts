import { HttpStatus, Injectable } from '@nestjs/common';
import { MeetupRepository } from './meetup.repository';
import { TagService } from '../tag/tag.service';
import { JwtPayloadDto, ReadAllResult } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { IReadAllMeetupOptions, MeetupEntity, MeetupCreationAttrs, MeetupUpdateAttrs } from './types';
import { CreateMeetupDto, UpdateMeetupDto } from './dto';
import { TagEntity } from '../tag/types';

@Injectable()
export class MeetupService {
  constructor(
    private readonly meetupRepository: MeetupRepository,
    private readonly tagService: TagService,
  ) {}

  async readAll(readAllOptions: IReadAllMeetupOptions): Promise<ReadAllResult<MeetupEntity>> {
    const readAllMeetups = await this.meetupRepository.readAll(readAllOptions);
    return readAllMeetups;
  }

  async readById(id: number): Promise<MeetupEntity> {
    const meetup = await this.meetupRepository.readById(id);
    return meetup;
  }

  async create(createMeetupDto: CreateMeetupDto, organizer: JwtPayloadDto): Promise<MeetupEntity> {
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

  async joinToMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupEntity> {
    const isJoined = await this.meetupRepository.isJoined(meetupId, member.id);
    if (isJoined) {
      throw new RpcException({ message: `You are already joined for this meetup`, statusCode: HttpStatus.BAD_REQUEST });
    }

    const meetup = await this.meetupRepository.joinToMeetup(meetupId, member.id);
    return meetup;
  }

  async leaveFromMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupEntity> {
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

  async update(id: number, updateMeetupDto: UpdateMeetupDto): Promise<MeetupEntity> {
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

    const tags = existingMeetup.tags.map((obj) => obj.tag);
    await this.meetupRepository.deleteById(id);
    await this._deleteUnrelatedTags(tags);
  }

  private async _createTagsIfNotExist(tagsTitle: string[]): Promise<TagEntity[]> {
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

  private async _deleteUnrelatedTags(tags: TagEntity[]) {
    for await (let tag of tags) {
      const isRelatedTag = await this.tagService.isRelated(tag.id);
      if (!isRelatedTag) {
        await this.tagService.deleteById(tag.id);
      }
    }
  }
}
