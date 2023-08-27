import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReadAllResult } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { AUTH_METADATA, AUTH_MICROSERVICE } from '../../common';
import { IReadAllUserOptions, UserType } from './types';

@Injectable()
export class UserService {
  constructor(@Inject(AUTH_MICROSERVICE.RMQ_CLIENT_NAME) private readonly client: ClientProxy) {}

  async readAll(readAllUserOptions: IReadAllUserOptions): Promise<ReadAllResult<UserType>> {
    const users = await firstValueFrom(this.client.send(AUTH_METADATA.MP_GET_ALL_USERS, readAllUserOptions));
    return users;
  }

  async readById(id: number): Promise<UserType> {
    const user = await firstValueFrom(this.client.send(AUTH_METADATA.MP_GET_USER_BY_ID, { id }));
    return user;
  }

  async deleteById(id: number): Promise<void> {
    await this.client.emit(AUTH_METADATA.EP_DELETE_USER_BY_ID, { id });
  }
}
