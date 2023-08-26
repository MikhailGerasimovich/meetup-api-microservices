import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class JwtRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readJwt(userId: number, refreshToken: string): Promise<string | undefined> {
    const token = await this.prisma.tokens.findFirst({
      where: {
        userId,
        refreshToken,
      },
      select: {
        refreshToken: true,
      },
    });

    return token?.refreshToken;
  }

  async saveJwt(userId: number, refreshToken: string): Promise<void> {
    await this.prisma.tokens.create({
      data: {
        userId,
        refreshToken,
      },
    });
  }

  async deleteJwt(userId: number, refreshToken: string): Promise<void> {
    await this.prisma.tokens.deleteMany({
      where: {
        userId,
        refreshToken,
      },
    });
  }

  async deleteAllUserJwt(userId: number): Promise<void> {
    await this.prisma.tokens.deleteMany({
      where: { userId },
    });
  }
}
