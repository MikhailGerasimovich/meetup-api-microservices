import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class JwtRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readJwt(userId: string, refreshToken: string): Promise<string | undefined> {
    const token = await this.prisma.tokens.findFirst({
      where: {
        userId: Number(userId),
        refreshToken,
      },
      select: {
        refreshToken: true,
      },
    });

    return token?.refreshToken;
  }

  async saveJwt(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.tokens.create({
      data: {
        userId: Number(userId),
        refreshToken,
      },
    });
  }

  async deleteJwt(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.tokens.deleteMany({
      where: { userId: Number(userId), refreshToken },
    });
  }

  async deleteAllUserJwt(userId: string): Promise<void> {
    await this.prisma.tokens.deleteMany({
      where: { userId: Number(userId) },
    });
  }
}
