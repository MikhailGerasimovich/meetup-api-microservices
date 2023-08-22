import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserCreationAttrs } from './types/user.creation-attrs';
import { User } from './types/user.entity';
import { IReadAllUserOptions } from './types/read-all-user.options';
import { ReadAllResult, defaultPagination, defaultSorting, offset } from '@app/common';
import { getUserFilters } from './filters/read-all-user.filter';
import { UserUpdateAttrs } from './types/user.update-attrs';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readAll(readAllOptions: IReadAllUserOptions): Promise<ReadAllResult<User>> {
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

  async readById(id: string): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where: { id: Number(id) },

      select: {
        id: true,
        login: true,
        email: true,
      },
    });
    return user;
  }

  async readByLogin(login: string): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where: { login },

      select: {
        id: true,
        login: true,
        email: true,
        password: true,
      },
    });
    return user;
  }

  async create(userCreationAttrs: UserCreationAttrs): Promise<User> {
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
      },
    });
    return createdUser;
  }

  async update(id: string, userUpdateAttrs: UserUpdateAttrs): Promise<User> {
    const updatedUser = await this.prisma.users.update({
      where: { id: Number(id) },
      data: {
        login: userUpdateAttrs.login,
        email: userUpdateAttrs.email,
      },

      select: {
        id: true,
        login: true,
        email: true,
      },
    });
    return updatedUser;
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.users.delete({
      where: { id: Number(id) },
    });
  }
}
