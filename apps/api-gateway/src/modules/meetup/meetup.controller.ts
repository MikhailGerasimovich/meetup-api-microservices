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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseReadAllDto, JwtPayloadDto, ReadAllResult } from '@app/common';
import { ApiCookieAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getAllMeetupSchemaOptions } from '../../common';
import { MeetupSearchResult, MeetupType, Report } from './types';
import { JoiValidationPipe, JwtAuthGuard, RolesGuard, UserFromRequest } from '../../common';
import { MeetupService } from './meetup.service';
import { CreateMeetupSchema, ReadAllMeetupSchema, ReportSchema, SearchMeetupSchema, UpdateMeetupSchema } from './schemas';
import { CreateMeetupDto, ReadAllMeetupDto, SearchMeetupDto, UpdateMeetupDto } from './dto';

@ApiTags('Meetup')
@ApiCookieAuth()
@ApiExtraModels(ReadAllMeetupDto, CreateMeetupDto, UpdateMeetupDto, BaseReadAllDto, MeetupType)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all meetups' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', schema: getAllMeetupSchemaOptions })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async readAll(
    @Query(new JoiValidationPipe(ReadAllMeetupSchema)) readAllMeetupDto: ReadAllMeetupDto,
  ): Promise<ReadAllResult<MeetupType>> {
    const { pagination, sorting, ...filters } = readAllMeetupDto;
    const meetups = await this.meetupService.readAll({ pagination, sorting, filters });
    return meetups;
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get meetups using full text search' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async search(@Query(new JoiValidationPipe(SearchMeetupSchema)) search: SearchMeetupDto): Promise<MeetupSearchResult> {
    const { text } = search;
    const searchResult = await this.meetupService.search(text);
    return searchResult;
  }

  @Get('generate-report/:type')
  @ApiOperation({ summary: 'Generate meetup reports pdf or csv' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async csvReport(
    @Query(new JoiValidationPipe(ReadAllMeetupSchema)) readAllMeetupDto: ReadAllMeetupDto,
    @Param(new JoiValidationPipe(ReportSchema)) report: Report,
    @Res() res: Response,
  ) {
    const { pagination, sorting, ...filters } = readAllMeetupDto;
    await this.meetupService.generateReport(report, { pagination, sorting, filters }, res);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get meetup by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: MeetupType })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async readById(@Param('id', ParseIntPipe) id: number): Promise<MeetupType> {
    const meetup = await this.meetupService.readById(id);
    return meetup;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new meetup for the user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: MeetupType })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(
    @Body(new JoiValidationPipe(CreateMeetupSchema)) createMeetupDto: CreateMeetupDto,
    @UserFromRequest() organizer: JwtPayloadDto,
  ): Promise<MeetupType> {
    const createdMeetup = await this.meetupService.create(createMeetupDto, organizer);
    return createdMeetup;
  }

  @Post('join/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register for the meetup' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: MeetupType })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  public async joinToMeetup(
    @Param('id', ParseIntPipe) meetupId: number,
    @UserFromRequest() member: JwtPayloadDto,
  ): Promise<MeetupType> {
    const meetup = await this.meetupService.joinToMeetup(meetupId, member);
    return meetup;
  }

  @Post('leave/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Leave from meetup' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success', type: MeetupType })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  public async leaveFromMeetup(
    @Param('id', ParseIntPipe) meetupId: number,
    @UserFromRequest() member: JwtPayloadDto,
  ): Promise<MeetupType> {
    const meetup = await this.meetupService.leaveFromMeetup(meetupId, member);
    return meetup;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update meetup by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: MeetupType })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Delete meetup by id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async deleteById(@Param('id', ParseIntPipe) id: number, @UserFromRequest() jwtPayload: JwtPayloadDto): Promise<void> {
    await this.meetupService.deleteById(id, jwtPayload);
  }
}
