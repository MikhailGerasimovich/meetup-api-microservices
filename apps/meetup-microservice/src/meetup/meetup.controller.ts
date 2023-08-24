import { Controller } from '@nestjs/common';
import { MeetupService } from './meetup.service';
import { MeetupFrontend } from './types/meetup.frontend';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { IReadAllMeetupOptions } from './types/read-all-meetup.options';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ReadAllResult } from '@app/common';
import { METADATA } from '../constants/constants';
import { JwtPayloadDto } from 'apps/authorization-microservice/src/auth/dto/jwt-payload.dto';

@Controller()
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @MessagePattern(METADATA.MP_GET_ALL_MEETUPS)
  async readAll(@Payload() readAllMeetupOptions: IReadAllMeetupOptions): Promise<ReadAllResult<MeetupFrontend>> {
    const meetups = await this.meetupService.readAll(readAllMeetupOptions);
    return {
      totalRecordsNumber: meetups.totalRecordsNumber,
      records: meetups.records.map((meetup) => new MeetupFrontend(meetup)),
    };
  }

  @MessagePattern(METADATA.MP_GET_MEETUP_BY_ID)
  async readById(@Payload('id') id: string): Promise<MeetupFrontend> {
    const meetup = await this.meetupService.readById(id);
    return new MeetupFrontend(meetup);
  }

  @MessagePattern(METADATA.MP_CREATE_MEETUP)
  async create(
    @Payload('createMeetupDto') createMeetupDto: CreateMeetupDto,
    @Payload('organizer') organizer: JwtPayloadDto,
  ): Promise<MeetupFrontend> {
    const createdMeetup = await this.meetupService.create(createMeetupDto, organizer);
    return new MeetupFrontend(createdMeetup);
  }

  @MessagePattern(METADATA.MP_JOIN_TO_MEETUP)
  async joinToMeetup(
    @Payload('meetupId') meetupId: string,
    @Payload('member') member: JwtPayloadDto,
  ): Promise<MeetupFrontend> {
    const meetup = await this.meetupService.joinToMeetup(meetupId, member);
    return new MeetupFrontend(meetup);
  }

  @MessagePattern(METADATA.MP_LEAVE_FROM_MEETUP)
  async leaveFromMeetup(
    @Payload('meetupId') meetupId: string,
    @Payload('member') member: JwtPayloadDto,
  ): Promise<MeetupFrontend> {
    const meetup = await this.meetupService.leaveFromMeetup(meetupId, member);
    return new MeetupFrontend(meetup);
  }

  @MessagePattern(METADATA.MP_UPDATE_MEETUP_BY_ID)
  async update(
    @Payload('id') id: string,
    @Payload('updateMeetupDto') updateMeetupDto: UpdateMeetupDto,
  ): Promise<MeetupFrontend> {
    const updatedMeetup = await this.meetupService.update(id, updateMeetupDto);
    return new MeetupFrontend(updatedMeetup);
  }

  @EventPattern(METADATA.EP_DELETE_MEETUP_BY_ID)
  async deleteById(@Payload('id') id: string): Promise<void> {
    await this.meetupService.deleteById(id);
  }
}
