import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Meetup } from './types/meetup.entity';
import { MeetupCreationAttrs } from './types/meetup.creation-attrs';
import { MeetupUpdateAttrs } from './types/meetup.update.attrs';

@Injectable()
export class MeetupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readAll(): Promise<Meetup[]> {
    const meetups = await this.prisma.meetups.findMany({
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });
    return meetups;
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
