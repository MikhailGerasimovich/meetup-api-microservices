import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtPayloadDto, ReadAllResult } from '@app/common';
import { MEETUP_METADATA, MEETUP_MICROSERVICE } from '../../common';
import { IReadAllMeetupOptions, MeetupType } from './types';
import { CreateMeetupDto, UpdateMeetupDto } from './dto';

@Injectable()
export class MeetupService {
  constructor(@Inject(MEETUP_MICROSERVICE.RMQ_CLIENT_NAME) private readonly client: ClientProxy) {}

  async readAll(readAllMeetupOptions: IReadAllMeetupOptions): Promise<ReadAllResult<MeetupType>> {
    const meetups = await firstValueFrom(this.client.send(MEETUP_METADATA.MP_GET_ALL_MEETUPS, readAllMeetupOptions));
    return meetups;
  }

  async readById(id: number): Promise<MeetupType> {
    const meetup = await firstValueFrom(this.client.send(MEETUP_METADATA.MP_GET_MEETUP_BY_ID, { id }));
    return meetup;
  }

  async create(createMeetupDto: CreateMeetupDto, organizer: JwtPayloadDto): Promise<MeetupType> {
    const createdMeetup = await firstValueFrom(
      this.client.send(MEETUP_METADATA.MP_CREATE_MEETUP, { createMeetupDto, organizer }),
    );
    return createdMeetup;
  }

  async joinToMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupType> {
    const meetup = await firstValueFrom(this.client.send(MEETUP_METADATA.MP_JOIN_TO_MEETUP, { meetupId, member }));
    return meetup;
  }

  async leaveFromMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupType> {
    const meetup = await firstValueFrom(this.client.send(MEETUP_METADATA.MP_LEAVE_FROM_MEETUP, { meetupId, member }));
    return meetup;
  }

  async update(id: number, updateTagDto: UpdateMeetupDto): Promise<MeetupType> {
    const updatedTag = await firstValueFrom(
      this.client.send(MEETUP_METADATA.MP_UPDATE_MEETUP_BY_ID, { id, updateTagDto }),
    );
    return updatedTag;
  }

  async deleteById(id: number): Promise<void> {
    await this.client.emit(MEETUP_METADATA.EP_DELETE_MEETUP_BY_ID, { id });
  }
}
