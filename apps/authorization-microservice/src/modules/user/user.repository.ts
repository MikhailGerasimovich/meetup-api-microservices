import { Injectable } from '@nestjs/common';
import { ReadAllResult, defaultPagination, defaultSorting, offset } from '@app/common';
import { getUserFilters } from './filters/read-all-user.filter';
import { PrismaService } from '../../database/prisma.service';
import { IReadAllUserOptions, UserEntity, UserCreationAttrs } from './types';

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
        login: true,
        email: true,
      },
    });

    const totalRecordsNumber = await this.prisma.users.count({ where: { ...filters.userFilters } });

    return { totalRecordsNumber, records };
  }

  async readById(id: number): Promise<UserEntity> {
    const user = await this.prisma.users.findUnique({
      where: { id },

      select: {
        id: true,
        login: true,
        email: true,
      },
    });
    return user;
  }

  async readByLogin(login: string, requiredFields?: string[]): Promise<UserEntity> {
    const toSelect = {};
    requiredFields?.forEach((field) => (toSelect[field] = true));

    const user = await this.prisma.users.findUnique({
      where: { login },

      select: {
        id: true,
        login: true,
        email: true,
        ...toSelect,
      },
    });
    return user;
  }

  async create(userCreationAttrs: UserCreationAttrs): Promise<UserEntity> {
    const createdUser = await this.prisma.users.create({
      data: {
        login: userCreationAttrs.login,
        email: userCreationAttrs.email,
        password: userCreationAttrs.password,
        roles: userCreationAttrs.roles,
      },

      select: {
        id: true,
        login: true,
        email: true,
        roles: true,
      },
    });
    return createdUser;
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.users.delete({
      where: { id },
    });
  }
}