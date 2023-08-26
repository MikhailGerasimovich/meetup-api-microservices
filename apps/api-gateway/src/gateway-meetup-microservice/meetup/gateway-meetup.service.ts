import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MeetupFrontend } from './types/meetup.frontend';
import { ReadAllResult } from '@app/common';
import { IReadAllMeetupOptions } from './types/read-all-meetup.options';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { MEETUP_METADATA, MEETUP_MICROSERVICE } from '../../constants/constants';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class GatewayMeetupService {
  constructor(@Inject(MEETUP_MICROSERVICE.RMQ_CLIENT_NAME) private readonly client: ClientProxy) {}

  async readAll(readAllMeetupOptions: IReadAllMeetupOptions): Promise<ReadAllResult<MeetupFrontend>> {
    const meetups = await firstValueFrom(this.client.send(MEETUP_METADATA.MP_GET_ALL_MEETUPS, readAllMeetupOptions));
    return meetups;
  }

  async readById(id: number): Promise<MeetupFrontend> {
    const meetup = await firstValueFrom(this.client.send(MEETUP_METADATA.MP_GET_MEETUP_BY_ID, { id }));
    return meetup;
  }

  async create(createMeetupDto: CreateMeetupDto, organizer: JwtPayloadDto): Promise<MeetupFrontend> {
    const createdMeetup = await firstValueFrom(
      this.client.send(MEETUP_METADATA.MP_CREATE_MEETUP, { createMeetupDto, organizer }),
    );
    return createdMeetup;
  }

  async joinToMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupFrontend> {
    const meetup = await firstValueFrom(this.client.send(MEETUP_METADATA.MP_JOIN_TO_MEETUP, { meetupId, member }));
    return meetup;
  }

  async leaveFromMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupFrontend> {
    const meetup = await firstValueFrom(this.client.send(MEETUP_METADATA.MP_LEAVE_FROM_MEETUP, { meetupId, member }));
    return meetup;
  }

  async update(id: number, updateTagDto: UpdateMeetupDto): Promise<MeetupFrontend> {
    const updatedTag = await firstValueFrom(
      this.client.send(MEETUP_METADATA.MP_UPDATE_MEETUP_BY_ID, { id, updateTagDto }),
    );
    return updatedTag;
  }

  async deleteById(id: number): Promise<void> {
    await this.client.emit(MEETUP_METADATA.EP_DELETE_MEETUP_BY_ID, { id });
  }
}
