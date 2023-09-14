import { Injectable } from '@nestjs/common';
import { ReadAllResult, defaultPagination, defaultSorting, offset } from '@app/common';
import { PrismaService } from '../database/prisma.service';
import { IReadAllMeetupOptions, MeetupEntity, MeetupCreationAttrs, MeetupUpdateAttrs } from './types';
import { getMeetupFilters } from './filters';
import { TransactionClient } from '../../common';

@Injectable()
export class MeetupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readAll(readAllOptions: IReadAllMeetupOptions): Promise<ReadAllResult<MeetupEntity>> {
    const page = readAllOptions?.pagination?.page || defaultPagination.page;
    const size = readAllOptions?.pagination?.size || defaultPagination.size;
    const column = readAllOptions?.sorting?.column ?? defaultSorting.column;
    const direction = readAllOptions?.sorting?.direction ?? defaultSorting.direction;
    const filters = getMeetupFilters(readAllOptions.filters);

    const geopositionSearchParam = {};
    if (Object.keys(filters.geoFilters).length != 0) {
      const { latitude, longitude } = filters.geoFilters.geoposition;
      const query = await this.prisma.$queryRaw<
        { id: number }[]
      >`SELECT id FROM "Meetups" WHERE ST_DWithin(ST_MakePoint(longitude::float, latitude::float), ST_MakePoint(${longitude}::float, ${latitude}::float)::geography, radius * 1000)`;

      geopositionSearchParam['id'] = { in: query.map(({ id }) => id) };
    }

    const records = await this.prisma.meetups.findMany({
      where: { ...filters.meetupFilters, ...filters.tagFilters, ...geopositionSearchParam },
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
      where: { ...filters.meetupFilters, ...filters.tagFilters, ...geopositionSearchParam },
    });

    return { totalRecordsNumber, records };
  }

  async readById(id: number, transaction?: TransactionClient): Promise<MeetupEntity> {
    const executer = transaction ? transaction : this.prisma;
    const meetup = await executer.meetups.findUnique({
      where: { id },
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

  async create(meetupCreationAttrs: MeetupCreationAttrs, transaction?: TransactionClient): Promise<MeetupEntity> {
    const executer = transaction ? transaction : this.prisma;
    const createdMeetup = await executer.meetups.create({
      data: {
        title: meetupCreationAttrs.title,
        description: meetupCreationAttrs.description,
        date: meetupCreationAttrs.date,
        place: meetupCreationAttrs.place,
        latitude: meetupCreationAttrs.latitude,
        longitude: meetupCreationAttrs.longitude,
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

  async joinToMeetup(meetupId: number, memberId: number, transaction?: TransactionClient): Promise<MeetupEntity> {
    const executer = transaction ? transaction : this.prisma;
    const meetup = await executer.meetups.update({
      where: { id: meetupId },
      data: {
        members: {
          create: {
            userId: memberId,
          },
        },
      },
    });

    return meetup;
  }

  async leaveFromMeetup(meetupId: number, memberId: number, transaction?: TransactionClient): Promise<MeetupEntity> {
    const executer = transaction ? transaction : this.prisma;
    const meetup = await executer.meetups.update({
      where: { id: meetupId },
      data: {
        members: {
          deleteMany: {
            userId: memberId,
          },
        },
      },
    });

    return meetup;
  }

  async isJoined(meetupId: number, memberId: number, transaction?: TransactionClient): Promise<boolean> {
    const executer = transaction ? transaction : this.prisma;
    const meetups = await executer.members.findMany({
      where: {
        meetupId: meetupId,
        userId: memberId,
      },
    });

    return meetups.length !== 0;
  }

  async update(id: number, meetupUpdateAttrs: MeetupUpdateAttrs, transaction?: TransactionClient): Promise<MeetupEntity> {
    const executer = transaction ? transaction : this.prisma;
    const data: any = {
      title: meetupUpdateAttrs.title,
      description: String(meetupUpdateAttrs.description),
      date: meetupUpdateAttrs.date,
      place: meetupUpdateAttrs.place,
      latitude: meetupUpdateAttrs.latitude,
      longitude: meetupUpdateAttrs.longitude,
      organizerId: Number(meetupUpdateAttrs.organizerId),
    };

    if (meetupUpdateAttrs.tags) {
      data.tags = {
        deleteMany: { meetupId: Number(id) },
        create: meetupUpdateAttrs.tags.map((tag) => ({ tag: { connect: { id: Number(tag.id) } } })),
      };
    }

    const updatedMeetup = await executer.meetups.update({
      where: { id },
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

  async deleteById(id: number, transaction?: TransactionClient): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.meetups.update({
      where: { id: id },
      data: {
        tags: {
          deleteMany: { meetupId: id },
        },
      },
    });

    await executer.meetups.delete({
      where: { id: id },
    });
  }
}
