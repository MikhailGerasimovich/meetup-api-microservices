import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtPayloadDto, ROLES, ReadAllResult } from '@app/common';
import { MeetupRepository } from './meetup.repository';
import { IReadAllMeetupOptions, MeetupEntity, MeetupCreationAttrs, MeetupUpdateAttrs } from './types';
import { CreateMeetupDto, UpdateMeetupDto } from './dto';
import { PrismaService } from '../database/prisma.service';
import { TagService } from '../tag/tag.service';
import { TagEntity } from '../tag/types';
import { TransactionClient } from '../../common';

@Injectable()
export class MeetupService {
  constructor(
    private readonly meetupRepository: MeetupRepository,
    private readonly tagService: TagService,
    private readonly prisma: PrismaService,
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
    const transactionResult = await this.prisma.$transaction(async (transaction: TransactionClient) => {
      const tags = await this._createTagsIfNotExist(createMeetupDto.tags, transaction);

      const meetupCreationAttrs: MeetupCreationAttrs = {
        title: createMeetupDto.title,
        description: createMeetupDto.description,
        date: createMeetupDto.date,
        place: createMeetupDto.place,
        tags: tags,
        organizerId: organizer.id,
      };

      const createdMeetup = await this.meetupRepository.create(meetupCreationAttrs, transaction);
      return createdMeetup;
    });
    return transactionResult;
  }

  async joinToMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupEntity> {
    const transactionResult = await this.prisma.$transaction(async (transaction: TransactionClient) => {
      const isJoined = await this.meetupRepository.isJoined(meetupId, member.id, transaction);
      if (isJoined) {
        throw new RpcException({ message: `You are already joined for this meetup`, statusCode: HttpStatus.BAD_REQUEST });
      }

      const meetup = await this.meetupRepository.joinToMeetup(meetupId, member.id, transaction);
      return meetup;
    });
    return transactionResult;
  }

  async leaveFromMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupEntity> {
    const transactionResult = await this.prisma.$transaction(async (transaction: TransactionClient) => {
      const isJoined = await this.meetupRepository.isJoined(meetupId, member.id, transaction);
      if (!isJoined) {
        throw new RpcException({
          message: `You can't leave a meeting you're not in`,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const meetup = await this.meetupRepository.leaveFromMeetup(meetupId, member.id, transaction);
      return meetup;
    });
    return transactionResult;
  }

  async update(id: number, updateMeetupDto: UpdateMeetupDto, jwtPayload: JwtPayloadDto): Promise<MeetupEntity> {
    const transactionResult = await this.prisma.$transaction(async (transaction: TransactionClient) => {
      const existingMeetup = await this.meetupRepository.readById(id, transaction);
      if (!existingMeetup) {
        throw new RpcException({ message: `The specified meetup does not exist`, statusCode: HttpStatus.BAD_REQUEST });
      }

      if (jwtPayload.id != existingMeetup.organizerId) {
        throw new RpcException({
          message: 'You do not have permission to perform this action',
          statusCode: HttpStatus.FORBIDDEN,
        });
      }

      const tags = updateMeetupDto.tags ? await this._createTagsIfNotExist(updateMeetupDto.tags, transaction) : null;

      const meetupUpdateAttrs: MeetupUpdateAttrs = {
        title: updateMeetupDto.title || existingMeetup.title,
        description: updateMeetupDto.description || existingMeetup.description,
        date: updateMeetupDto.date || existingMeetup.date,
        place: updateMeetupDto.place || existingMeetup.place,
        tags: tags,
      };

      const updatedMeetup = await this.meetupRepository.update(id, meetupUpdateAttrs, transaction);
      return updatedMeetup;
    });
    return transactionResult;
  }

  async deleteById(id: number, jwtPayload: JwtPayloadDto): Promise<void> {
    await this.prisma.$transaction(async (transaction: TransactionClient) => {
      const existingMeetup = await this.meetupRepository.readById(id, transaction);
      if (!existingMeetup) {
        throw new RpcException({ message: `The specified meetup does not exist`, statusCode: HttpStatus.BAD_REQUEST });
      }

      if (jwtPayload.id != existingMeetup.organizerId && jwtPayload.role != ROLES.ADMIN) {
        throw new RpcException({
          message: 'You do not have permission to perform this action',
          statusCode: HttpStatus.FORBIDDEN,
        });
      }

      const tags = existingMeetup.tags.map((obj) => obj.tag);
      await this.meetupRepository.deleteById(id, transaction);
      await this._deleteUnrelatedTags(tags, transaction);
    });
  }

  private async _createTagsIfNotExist(tagsTitle: string[], transaction?: TransactionClient): Promise<TagEntity[]> {
    const tags = [];
    for await (let title of tagsTitle) {
      const existingTag = await this.tagService.readByTitle(title, transaction);
      if (!existingTag) {
        tags.push(await this.tagService.create({ title: title }, transaction));
        continue;
      }
      tags.push(existingTag);
    }
    return tags;
  }

  private async _deleteUnrelatedTags(tags: TagEntity[], transaction?: TransactionClient) {
    for await (let tag of tags) {
      const isRelatedTag = await this.tagService.isRelated(tag.id, transaction);
      if (!isRelatedTag) {
        await this.tagService.deleteById(tag.id, transaction);
      }
    }
  }
}
