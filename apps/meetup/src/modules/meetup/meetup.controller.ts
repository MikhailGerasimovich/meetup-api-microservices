import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtPayloadDto, METADATA, ReadAllResult } from '@app/common';
import { MeetupService } from './meetup.service';
import { IReadAllMeetupOptions, MeetupType } from './types';
import { CreateMeetupDto, UpdateMeetupDto } from './dto';
import { MeetupSearchResult } from '../search/types';

@Controller()
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @MessagePattern(METADATA.MP_GET_ALL_MEETUPS)
  async readAll(
    @Payload('readAllMeetupOptions') readAllMeetupOptions: IReadAllMeetupOptions,
  ): Promise<ReadAllResult<MeetupType>> {
    const meetups = await this.meetupService.readAll(readAllMeetupOptions);
    return {
      totalRecordsNumber: meetups.totalRecordsNumber,
      records: meetups.records.map((meetup) => new MeetupType(meetup)),
    };
  }

  @MessagePattern(METADATA.MP_SEARCH)
  async search(@Payload('searchText') searchText: string): Promise<MeetupSearchResult> {
    const data = await this.meetupService.search(searchText);
    return data;
  }

  @MessagePattern(METADATA.MP_GET_MEETUP_BY_ID)
  async readById(@Payload('id', ParseIntPipe) id: number): Promise<MeetupType> {
    const meetup = await this.meetupService.readById(id);
    return new MeetupType(meetup);
  }

  @MessagePattern(METADATA.MP_CREATE_MEETUP)
  async create(
    @Payload('createMeetupDto') createMeetupDto: CreateMeetupDto,
    @Payload('organizer') organizer: JwtPayloadDto,
  ): Promise<MeetupType> {
    const createdMeetup = await this.meetupService.create(createMeetupDto, organizer);
    return new MeetupType(createdMeetup);
  }

  @MessagePattern(METADATA.MP_JOIN_TO_MEETUP)
  async joinToMeetup(
    @Payload('meetupId', ParseIntPipe) meetupId: number,
    @Payload('member') member: JwtPayloadDto,
  ): Promise<MeetupType> {
    const meetup = await this.meetupService.joinToMeetup(meetupId, member);
    return new MeetupType(meetup);
  }

  @MessagePattern(METADATA.MP_LEAVE_FROM_MEETUP)
  async leaveFromMeetup(
    @Payload('meetupId', ParseIntPipe) meetupId: number,
    @Payload('member') member: JwtPayloadDto,
  ): Promise<MeetupType> {
    const meetup = await this.meetupService.leaveFromMeetup(meetupId, member);
    return new MeetupType(meetup);
  }

  @MessagePattern(METADATA.MP_UPDATE_MEETUP_BY_ID)
  async update(
    @Payload('id', ParseIntPipe) id: number,
    @Payload('updateMeetupDto') updateMeetupDto: UpdateMeetupDto,
    @Payload('jwtPayload') jwtPayload: JwtPayloadDto,
  ): Promise<MeetupType> {
    const updatedMeetup = await this.meetupService.update(id, updateMeetupDto, jwtPayload);
    return new MeetupType(updatedMeetup);
  }

  @MessagePattern(METADATA.MP_DELETE_MEETUP_BY_ID)
  async deleteById(@Payload('id', ParseIntPipe) id: number, @Payload('jwtPayload') jwtPayload: JwtPayloadDto): Promise<void> {
    await this.meetupService.deleteById(id, jwtPayload);
  }
}
