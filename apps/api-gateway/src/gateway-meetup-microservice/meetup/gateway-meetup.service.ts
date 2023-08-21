import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MeetupFrontend } from './types/meetup.frontend';
import { ReadAllResult } from '@app/common';
import { IReadAllMeetupOptions } from './types/read-all-meetup.options';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { UpdateMeetupDto } from './dto/update-meetup.dto';

@Injectable()
export class GatewayMeetupService {
  constructor(@Inject('GATEWAY_MEETUP_SERVICE') private readonly client: ClientProxy) {}

  async readAll(readAllMeetupOptions: IReadAllMeetupOptions): Promise<ReadAllResult<MeetupFrontend>> {
    const meetups = await firstValueFrom(this.client.send('GET_ALL_MEETUPS', readAllMeetupOptions));
    return meetups;
  }

  async readById(id: string): Promise<MeetupFrontend> {
    const meetup = await firstValueFrom(this.client.send('GET_MEETUP_BY_ID', { id }));
    return meetup;
  }

  async create(createMeetupDto: CreateMeetupDto): Promise<MeetupFrontend> {
    const createdMeetup = await firstValueFrom(this.client.send('CREATE_MEETUP', createMeetupDto));
    return createdMeetup;
  }

  async update(id: string, updateMeetupDto: UpdateMeetupDto): Promise<MeetupFrontend> {
    const updatedMeetup = await firstValueFrom(this.client.send('UPDATE_MEETUP_BY_ID', { id, updateMeetupDto }));
    return updatedMeetup;
  }

  async deleteById(id: string): Promise<void> {
    await this.client.emit('DELETE_MEETUP_BY_ID', { id });
  }
}
