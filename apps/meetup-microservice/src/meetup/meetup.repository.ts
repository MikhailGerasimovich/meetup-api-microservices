import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Meetup } from './types/meetup.entity';
import { MeetupCreationAttrs } from './types/meetup.creation-attrs';
import { MeetupUpdateAttrs } from './types/meetup.update.attrs';
import { IReadAllMeetupOptions } from './types/read-all-meetup.options';
import { ReadAllResult, defaultPagination, defaultSorting, offset } from '@app/common';
import { getMeetupFilters } from './filters/read-all-meetup.filter';

@Injectable()
export class MeetupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readAll(readAllOptions: IReadAllMeetupOptions): Promise<ReadAllResult<Meetup>> {
    const page = readAllOptions?.pagination?.page || defaultPagination.page;
    const size = readAllOptions?.pagination?.size || defaultPagination.size;

    const column = readAllOptions?.sorting?.column ?? defaultSorting.column;
    const direction = readAllOptions?.sorting?.direction ?? defaultSorting.direction;

    const filters = getMeetupFilters(readAllOptions.filters);

    const records = await this.prisma.meetups.findMany({
      where: { ...filters.meetupFilters, ...filters.tagFilters },
      skip: offset(page, size),
      take: Number(size),
      orderBy: {
        [column]: direction,
      },

      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    const totalRecordsNumber = await this.prisma.meetups.count({
      where: { ...filters.meetupFilters, ...filters.tagFilters },
    });

    return { totalRecordsNumber, records };
  }

  async readById(id: string): Promise<Meetup> {
    const meetup = await this.prisma.meetups.findUnique({
      where: { id: Number(id) },
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });
    return meetup;
  }

  async create(meetupCreationAttrs: MeetupCreationAttrs): Promise<Meetup> {
    const createdMeetup = await this.prisma.meetups.create({
      data: {
        title: meetupCreationAttrs.title,
        description: meetupCreationAttrs.description,
        date: meetupCreationAttrs.date,
        place: meetupCreationAttrs.place,
        organizerId: Number(meetupCreationAttrs.organizerId),
        tags: {
          create: meetupCreationAttrs.tags.map((tag) => ({
            tag: { connect: { id: Number(tag.id) } },
          })),
        },
      },

      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });
    return createdMeetup;
  }

  async joinToMeetup(meetupId: string, memberId: string): Promise<Meetup> {
    const meetup = await this.prisma.meetups.update({
      where: { id: Number(meetupId) },
      data: {
        members: {
          create: {
            userId: Number(memberId),
          },
        },
      },
    });

    return meetup;
  }

  async leaveFromMeetup(meetupId: string, memberId: string): Promise<Meetup> {
    const meetup = await this.prisma.meetups.update({
      where: { id: Number(meetupId) },
      data: {
        members: {
          deleteMany: {
            userId: Number(memberId),
          },
        },
      },
    });

    return meetup;
  }

  async isJoined(meetupId: string, memberId: string): Promise<boolean> {
    const meetups = await this.prisma.members.findMany({
      where: {
        meetupId: Number(meetupId),
        userId: Number(memberId),
      },
    });

    return meetups.length !== 0;
  }

  async update(id: string, meetupUpdateAttrs: MeetupUpdateAttrs): Promise<Meetup> {
    const data: any = {
      title: meetupUpdateAttrs.title,
      description: String(meetupUpdateAttrs.description),
      date: meetupUpdateAttrs.date,
      place: meetupUpdateAttrs.place,
      organizerId: Number(meetupUpdateAttrs.organizerId),
    };

    if (meetupUpdateAttrs.tags) {
      data.tags = {
        deleteMany: { meetupId: Number(id) },
        create: meetupUpdateAttrs.tags.map((tag) => ({ tag: { connect: { id: Number(tag.id) } } })),
      };
    }

    const updatedMeetup = await this.prisma.meetups.update({
      where: { id: Number(id) },
      data: data,
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });
    return updatedMeetup;
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.meetups.update({
      where: { id: Number(id) },
      data: {
        tags: {
          deleteMany: { meetupId: Number(id) },
        },
      },
    });

    await this.prisma.meetups.delete({
      where: { id: Number(id) },
    });
  }
}
