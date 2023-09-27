import { Injectable } from '@nestjs/common';
import { ReadAllResult, defaultPagination, defaultSorting, offset } from '@app/common';
import { PrismaService } from '../../database/prisma.service';
import { getUserFilters } from './filters/read-all-user.filter';
import { IReadAllUserOptions, UserEntity, UserCreationAttrs } from './types';
import { TransactionClient } from '../../common';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readAll(readAllOptions: IReadAllUserOptions): Promise<ReadAllResult<UserEntity>> {
    const page = readAllOptions?.pagination?.page || defaultPagination.page;
    const size = readAllOptions?.pagination?.size || defaultPagination.size;
    const column = readAllOptions?.sorting?.column ?? defaultSorting.column;
    const direction = readAllOptions?.sorting?.direction ?? defaultSorting.direction;
    const filters = getUserFilters(readAllOptions?.filters);

    const records = await this.prisma.users.findMany({
      where: { ...filters.userFilters },
      skip: offset(page, size),
      take: Number(size),
      orderBy: {
        [column]: direction,
      },

      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    const totalRecordsNumber = await this.prisma.users.count({ where: { ...filters.userFilters } });
    return { totalRecordsNumber, records };
  }

  async readById(id: number, selectFields?: string[], transaction?: TransactionClient): Promise<UserEntity> {
    const executer = transaction ? transaction : this.prisma;
    const toSelect = this.getSelectFields(selectFields);
    const user = await executer.users.findUnique({
      where: { id },
      select: {
        id: true,
        ...toSelect,
      },
    });
    return user;
  }

  async readByEmail(email: string, selectFields?: string[], transaction?: TransactionClient): Promise<UserEntity> {
    const executer = transaction ? transaction : this.prisma;
    const toSelect = this.getSelectFields(selectFields);
    const user = await executer.users.findFirst({
      where: { email: email },
      select: {
        id: true,
        ...toSelect,
      },
    });
    return user;
  }

  async create(
    userCreationAttrs: UserCreationAttrs,
    selectFields?: string[],
    transaction?: TransactionClient,
  ): Promise<UserEntity> {
    const executer = transaction ? transaction : this.prisma;
    const toSelect = this.getSelectFields(selectFields);
    const createdUser = await executer.users.create({
      data: { ...userCreationAttrs },
      select: {
        id: true,
        ...toSelect,
      },
    });
    return createdUser;
  }

  async deleteById(id: number, transaction?: TransactionClient): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.users.delete({
      where: { id },
    });
  }

  async uploadAvatar(id: number, filename: string, transaction?: TransactionClient): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.users.update({
      where: { id },
      data: {
        avatarFilename: filename,
      },
    });
  }

  async downloadAvatar(id: number, transaction?: TransactionClient): Promise<string> {
    const executer = transaction ? transaction : this.prisma;
    const user = await executer.users.findUnique({
      where: { id },
      select: {
        avatarFilename: true,
      },
    });
    return user.avatarFilename;
  }

  async removeAvatar(id: number, transaction?: TransactionClient) {
    const executer = transaction ? transaction : this.prisma;
    await executer.users.update({
      where: { id },
      data: {
        avatarFilename: null,
      },
    });
  }

  private getSelectFields(selectFields: string[]) {
    if (!selectFields || selectFields.length == 0) {
      selectFields = ['username', 'email'];
    }
    const toSelect = {};
    selectFields?.forEach((field) => (toSelect[field] = true));
    return toSelect;
  }
}
