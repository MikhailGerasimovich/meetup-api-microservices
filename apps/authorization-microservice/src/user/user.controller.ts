import { Controller, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserFrontend } from './types/user.frontend';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_METADATA } from '../constants/constants';
import { IReadAllUserOptions } from './types/read-all-user.options';
import { ReadAllResult } from '@app/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(AUTH_METADATA.MP_GET_ALL_USERS)
  async readAll(@Payload() readAllUserOptions: IReadAllUserOptions): Promise<ReadAllResult<UserFrontend>> {
    const users = await this.userService.readAll(readAllUserOptions);
    return {
      totalRecordsNumber: users.totalRecordsNumber,
      records: users.records.map((user) => new UserFrontend(user)),
    };
  }

  @MessagePattern(AUTH_METADATA.MP_GET_USER_BY_ID)
  async readById(@Payload('id', ParseIntPipe) id: number): Promise<UserFrontend> {
    const user = await this.userService.readById(id);
    return new UserFrontend(user);
  }

  @EventPattern(AUTH_METADATA.EP_DELETE_USER_BY_ID)
  async deleteById(@Payload('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.deleteById(id);
  }
}
