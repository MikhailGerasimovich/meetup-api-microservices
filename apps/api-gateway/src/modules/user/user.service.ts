import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { METADATA, ReadAllResult } from '@app/common';
import { AUTH_MICROSERVICE, sendMessage } from '../../common';
import { IReadAllUserOptions, UserType } from './types';

@Injectable()
export class UserService {
  constructor(@Inject(AUTH_MICROSERVICE.RMQ_CLIENT_NAME) private readonly client: ClientProxy) {}

  async readAll(readAllUserOptions: IReadAllUserOptions): Promise<ReadAllResult<UserType>> {
    const users = await sendMessage<ReadAllResult<UserType>>({
      client: this.client,
      metadata: METADATA.MP_GET_ALL_USERS,
      data: readAllUserOptions,
    });

    return users;
  }

  async readById(id: number): Promise<UserType> {
    const user = await sendMessage<UserType>({
      client: this.client,
      metadata: METADATA.MP_GET_USER_BY_ID,
      data: { id },
    });

    return user;
  }

  async deleteById(id: number): Promise<void> {
    await sendMessage<void>({
      client: this.client,
      metadata: METADATA.EP_DELETE_USER_BY_ID,
      data: { id },
    });
  }
}
