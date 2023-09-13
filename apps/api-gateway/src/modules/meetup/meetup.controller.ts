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
import { JwtPayloadDto, ReadAllResult } from '@app/common';
import { JoiValidationPipe, JwtAuthGuard, RolesGuard, UserFromRequest } from '../../common';
import { MeetupService } from './meetup.service';
import { CreateMeetupSchema, ReadAllMeetupSchema, SearchMeetupSchema, UpdateMeetupSchema } from './schemas';
import { CreateMeetupDto, ReadAllMeetupDto, UpdateMeetupDto } from './dto';
import { MeetupSearchResult, MeetupType } from './types';

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

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(@Query(new JoiValidationPipe(SearchMeetupSchema)) query: any): Promise<MeetupSearchResult> {
    const { text } = query;
    const searchResult = await this.meetupService.search(text);
    return searchResult;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id', ParseIntPipe) id: number): Promise<MeetupType> {
    const meetup = await this.meetupService.readById(id);
    return meetup;
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

  @Post('join/:id')
  @HttpCode(HttpStatus.CREATED)
  public async joinToMeetup(
    @Param('id', ParseIntPipe) meetupId: number,
    @UserFromRequest() member: JwtPayloadDto,
  ): Promise<MeetupType> {
    const meetup = await this.meetupService.joinToMeetup(meetupId, member);
    return meetup;
  }

  @Post('leave/:id')
  @HttpCode(HttpStatus.CREATED)
  public async leaveFromMeetup(
    @Param('id', ParseIntPipe) meetupId: number,
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
    @UserFromRequest() jwtPayload: JwtPayloadDto,
  ): Promise<MeetupType> {
    const updatedMeetup = await this.meetupService.update(id, updateMeetupDto, jwtPayload);
    return updatedMeetup;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number, @UserFromRequest() jwtPayload: JwtPayloadDto): Promise<void> {
    await this.meetupService.deleteById(id, jwtPayload);
  }
}
