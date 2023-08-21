import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete, Query } from '@nestjs/common';
import { GatewayMeetupService } from './gateway-meetup.service';
import { ReadAllMeetupSchema } from './schemas/read-all-meetup.schema';
import { ReadAllMeetupDto } from './dto/read-all-meetup.dto';
import { JoiValidationPipe, ReadAllResult } from '@app/common';
import { MeetupFrontend } from './types/meetup.frontend';
import { CreateMeetupSchema } from './schemas/create-meetup.schema';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { UpdateMeetupSchema } from './schemas/update-meetup.schema';
import { UpdateMeetupDto } from './dto/update-meetup.dto';

@Controller('meetup')
export class GatewayMeetupController {
  constructor(private readonly gatewayMeetupService: GatewayMeetupService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async readAll(
    @Query(new JoiValidationPipe(ReadAllMeetupSchema)) readAllMeetupDto: ReadAllMeetupDto,
  ): Promise<ReadAllResult<MeetupFrontend>> {
    const { pagination, sorting, ...filters } = readAllMeetupDto;
    const meetups = await this.gatewayMeetupService.readAll({ pagination, sorting, filters });
    return meetups;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id') id: string): Promise<MeetupFrontend> {
    const tag = await this.gatewayMeetupService.readById(id);
    return tag;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new JoiValidationPipe(CreateMeetupSchema)) createMeetupDto: CreateMeetupDto,
  ): Promise<MeetupFrontend> {
    const createdMeetup = await this.gatewayMeetupService.create(createMeetupDto);
    return createdMeetup;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateMeetupSchema)) updateMeetupDto: UpdateMeetupDto,
  ): Promise<MeetupFrontend> {
    const updatedMeetup = await this.gatewayMeetupService.update(id, updateMeetupDto);
    return updatedMeetup;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.gatewayMeetupService.deleteById(id);
  }
}
