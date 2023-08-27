import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MeetupService } from './meetup.service';
import { JoiValidationPipe, JwtAuthGuard, RolesGuard, UserFromRequest } from '../../common';
import { JwtPayloadDto, ReadAllResult } from '@app/common';
import { CreateMeetupSchema, ReadAllMeetupSchema, UpdateMeetupSchema } from './schemas';
import { CreateMeetupDto, ReadAllMeetupDto, UpdateMeetupDto } from './dto';
import { MeetupType } from './types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async readAll(
    @Query(new JoiValidationPipe(ReadAllMeetupSchema)) readAllMeetupDto: ReadAllMeetupDto,
  ): Promise<ReadAllResult<MeetupType>> {
    const { pagination, sorting, ...filters } = readAllMeetupDto;
    const meetups = await this.meetupService.readAll({ pagination, sorting, filters });
    return meetups;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id', ParseIntPipe) id: number): Promise<MeetupType> {
    const tag = await this.meetupService.readById(id);
    return tag;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new JoiValidationPipe(CreateMeetupSchema)) createMeetupDto: CreateMeetupDto,
    @UserFromRequest() organizer: JwtPayloadDto,
  ): Promise<MeetupType> {
    const createdMeetup = await this.meetupService.create(createMeetupDto, organizer);
    return createdMeetup;
  }

  @Post('join/:meetupId')
  @HttpCode(HttpStatus.CREATED)
  public async joinToMeetup(
    @Param('meetupId', ParseIntPipe) meetupId: number,
    @UserFromRequest() member: JwtPayloadDto,
  ): Promise<MeetupType> {
    const meetup = await this.meetupService.joinToMeetup(meetupId, member);
    return meetup;
  }

  @Post('leave/:meetupId')
  @HttpCode(HttpStatus.CREATED)
  public async leaveFromMeetup(
    @Param('meetupId', ParseIntPipe) meetupId: number,
    @UserFromRequest() member: JwtPayloadDto,
  ): Promise<MeetupType> {
    const meetup = await this.meetupService.leaveFromMeetup(meetupId, member);
    return meetup;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(UpdateMeetupSchema)) updateMeetupDto: UpdateMeetupDto,
  ): Promise<MeetupType> {
    const updatedMeetup = await this.meetupService.update(id, updateMeetupDto);
    return updatedMeetup;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.meetupService.deleteById(id);
  }
}