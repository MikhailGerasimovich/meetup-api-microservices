import { Controller, Get, HttpCode, HttpStatus, Param, Body, Post, Put, Delete } from '@nestjs/common';
import { JoiValidationPipe } from '@app/common';
import { MeetupService } from './meetup.service';
import { MeetupFrontend } from './types/meetup.frontend';
import { CreateMeetupSchema } from './schemas/create-meetup.schema';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { UpdateMeetupSchema } from './schemas/update-meetup.schema';
import { UpdateMeetupDto } from './dto/update-meetup.dto';

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async readAll(): Promise<MeetupFrontend[]> {
    const meetups = await this.meetupService.readAll();
    return meetups.map((meetup) => new MeetupFrontend(meetup));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id') id: string): Promise<MeetupFrontend> {
    const meetup = await this.meetupService.readById(id);
    return new MeetupFrontend(meetup);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new JoiValidationPipe(CreateMeetupSchema)) createMeetupDto: CreateMeetupDto,
  ): Promise<MeetupFrontend> {
    const createdMeetup = await this.meetupService.create(createMeetupDto);
    return new MeetupFrontend(createdMeetup);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateMeetupSchema)) updateMeetupDto: UpdateMeetupDto,
  ): Promise<MeetupFrontend> {
    const updatedMeetup = await this.meetupService.update(id, updateMeetupDto);
    return new MeetupFrontend(updatedMeetup);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.meetupService.deleteById(id);
  }
}
