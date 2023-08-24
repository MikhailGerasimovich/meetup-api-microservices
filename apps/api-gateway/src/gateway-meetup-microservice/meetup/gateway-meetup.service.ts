import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MeetupFrontend } from './types/meetup.frontend';
import { ReadAllResult } from '@app/common';
import { IReadAllMeetupOptions } from './types/read-all-meetup.options';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { MEETUP_METADATA, MEETUP_MICROSERVICE } from '../../constants/constants';

@Injectable()
export class GatewayMeetupService {
  constructor(@Inject(MEETUP_MICROSERVICE.RMQ_CLIENT_NAME) private readonly client: ClientProxy) {}

  async readAll(readAllMeetupOptions: IReadAllMeetupOptions): Promise<ReadAllResult<MeetupFrontend>> {
    const meetups = await firstValueFrom(this.client.send(MEETUP_METADATA.MP_GET_ALL_MEETUPS, readAllMeetupOptions));
    return meetups;
  }

  async readById(id: string): Promise<MeetupFrontend> {
    const meetup = await firstValueFrom(this.client.send(MEETUP_METADATA.MP_GET_MEETUP_BY_ID, { id }));
    return meetup;
  }

  async create(createMeetupDto: CreateMeetupDto): Promise<MeetupFrontend> {
    const createdMeetup = await firstValueFrom(this.client.send(MEETUP_METADATA.MP_CREATE_MEETUP, createMeetupDto));
    return createdMeetup;
  }

  async update(id: string, updateTagDto: UpdateMeetupDto): Promise<MeetupFrontend> {
    const updatedTag = await firstValueFrom(
      this.client.send(MEETUP_METADATA.MP_UPDATE_MEETUP_BY_ID, { id, updateTagDto }),
    );
    return updatedTag;
  }

  async deleteById(id: string): Promise<void> {
    await this.client.emit(MEETUP_METADATA.EP_DELETE_MEETUP_BY_ID, { id });
  }
}
