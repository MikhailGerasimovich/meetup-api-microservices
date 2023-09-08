import { PrismaClient } from '@prisma-auth/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  const users = await prisma.users.createMany({
    data: [
      {
        username: 'admin',
        password: '$2a$10$Gmgzb05mYzuZjljIZPbA.OsVdML7OI/y80hUF.uB755VEJGzS6MF2', //password_admin
        email: 'admin@mail.ru',
        provider: 'local',
        role: 'ADMIN',
      },
      {
        username: 'user',
        password: '$2a$10$ZSrtVPKSTu3YmIHpr4HlM..hGgFQxuPelBKgIvGDX1p1z5EgtEn2a', //password_user
        email: 'user@mail.ru',
        provider: 'local',
        role: 'USER',
      },
    ],
    skipDuplicates: true,
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
