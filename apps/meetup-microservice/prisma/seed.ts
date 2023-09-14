import { PrismaClient } from '@prisma-meetup/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  const meetup1 = await prisma.meetups.create({
    data: {
      title: 'meetup 1',
      description: 'description to meetup 1',
      place: 'Vitebsk, Bogdan Khmelnitsky Street, 30',
      date: '12-12-2022 12:12:12',
      organizerId: 1,
      latitude: 55.201639,
      longitude: 30.267639,
      radius: 100,
      tags: {
        create: [
          {
            tag: { create: { title: 'dev' } },
          },
          {
            tag: { create: { title: 'js' } },
          },
        ],
      },
    },
  });

  const meetup2 = await prisma.meetups.create({
    data: {
      title: 'meetup 2',
      description: 'description to meetup 2',
      place: 'Vitebsk, Bogdan Khmelnitsky Street, 30',
      date: '12-12-2022 12:12:12',
      organizerId: 2,
      latitude: 55.201639,
      longitude: 30.267639,
      radius: 100,
      tags: {
        create: [
          {
            tag: { create: { title: 'nest' } },
          },
          {
            tag: { create: { title: 'ts' } },
          },
        ],
      },
    },
  });

  const meetup3 = await prisma.meetups.create({
    data: {
      title: 'meetup 3',
      description: 'description to meetup 3',
      place: 'Vitebsk, Bogdan Khmelnitsky Street, 30',
      date: '12-12-2022 12:12:12',
      organizerId: 2,
      latitude: 55.201639,
      longitude: 30.267639,
      radius: 100,
      tags: {
        create: [
          {
            tag: { create: { title: 'database' } },
          },
          {
            tag: { create: { title: 'postgresql' } },
          },
        ],
      },
      members: { create: { userId: 1 } },
    },
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
