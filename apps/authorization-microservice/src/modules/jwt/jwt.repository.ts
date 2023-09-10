import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TransactionClient } from '../../common';

@Injectable()
export class JwtRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readJwt(userId: number, refreshToken: string, transaction?: TransactionClient): Promise<string | undefined> {
    const executer = transaction ? transaction : this.prisma;
    const token = await executer.tokens.findFirst({
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

  async saveJwt(userId: number, refreshToken: string, transaction?: TransactionClient): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.tokens.create({
      data: {
        userId,
        refreshToken,
      },
    });
  }

  async deleteJwt(userId: number, refreshToken: string, transaction?: TransactionClient): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.tokens.deleteMany({
      where: {
        userId,
        refreshToken,
      },
    });
  }

  async deleteAllUserJwt(userId: number, transaction?: TransactionClient): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.tokens.deleteMany({
      where: { userId },
    });
  }
}
