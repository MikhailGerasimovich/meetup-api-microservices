import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtPayloadDto, METADATA, ReadAllResult } from '@app/common';
import { MEETUP, sendMessage } from '../../common';
import { IReadAllMeetupOptions, MeetupSearchResult, MeetupType } from './types';
import { CreateMeetupDto, UpdateMeetupDto } from './dto';

@Injectable()
export class MeetupService {
  constructor(@Inject(MEETUP.RMQ_CLIENT_NAME) private readonly client: ClientProxy) {}

  async readAll(readAllMeetupOptions: IReadAllMeetupOptions): Promise<ReadAllResult<MeetupType>> {
    const meetups = await sendMessage<ReadAllResult<MeetupType>>({
      client: this.client,
      metadata: METADATA.MP_GET_ALL_MEETUPS,
      data: readAllMeetupOptions,
    });

    return meetups;
  }

  async search(searchText: string): Promise<MeetupSearchResult> {
    const searchResult = await sendMessage<MeetupSearchResult>({
      client: this.client,
      metadata: METADATA.MP_SEARCH,
      data: { searchText },
    });
    return searchResult;
  }

  async readById(id: number): Promise<MeetupType> {
    const meetup = await sendMessage<MeetupType>({
      client: this.client,
      metadata: METADATA.MP_GET_MEETUP_BY_ID,
      data: { id },
    });

    return meetup;
  }

  async create(createMeetupDto: CreateMeetupDto, organizer: JwtPayloadDto): Promise<MeetupType> {
    const createdMeetup = await sendMessage<MeetupType>({
      client: this.client,
      metadata: METADATA.MP_CREATE_MEETUP,
      data: { createMeetupDto, organizer },
    });

    return createdMeetup;
  }

  async joinToMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupType> {
    const meetup = await sendMessage<MeetupType>({
      client: this.client,
      metadata: METADATA.MP_JOIN_TO_MEETUP,
      data: { meetupId, member },
    });

    return meetup;
  }

  async leaveFromMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupType> {
    const meetup = await sendMessage<MeetupType>({
      client: this.client,
      metadata: METADATA.MP_LEAVE_FROM_MEETUP,
      data: { meetupId, member },
    });

    return meetup;
  }

  async update(id: number, updateMeetupDto: UpdateMeetupDto, jwtPayload: JwtPayloadDto): Promise<MeetupType> {
    const updatedTag = await sendMessage<MeetupType>({
      client: this.client,
      metadata: METADATA.MP_UPDATE_MEETUP_BY_ID,
      data: { id, updateMeetupDto, jwtPayload },
    });

    return updatedTag;
  }

  async deleteById(id: number, jwtPayload: JwtPayloadDto): Promise<void> {
    await sendMessage({
      client: this.client,
      metadata: METADATA.MP_DELETE_MEETUP_BY_ID,
      data: { id, jwtPayload },
    });
  }
}
