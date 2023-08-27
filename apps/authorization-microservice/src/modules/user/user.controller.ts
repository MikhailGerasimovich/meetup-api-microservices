import { Controller, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { METADATA, ReadAllResult } from '@app/common';
import { IReadAllUserOptions, UserType } from './types';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(METADATA.MP_GET_ALL_USERS)
  async readAll(@Payload() readAllUserOptions: IReadAllUserOptions): Promise<ReadAllResult<UserType>> {
    const users = await this.userService.readAll(readAllUserOptions);
    return {
      totalRecordsNumber: users.totalRecordsNumber,
      records: users.records.map((user) => new UserType(user)),
    };
  }

  @MessagePattern(METADATA.MP_GET_USER_BY_ID)
  async readById(@Payload('id', ParseIntPipe) id: number): Promise<UserType> {
    const user = await this.userService.readById(id);
    return new UserType(user);
  }

  @EventPattern(METADATA.EP_DELETE_USER_BY_ID)
  async deleteById(@Payload('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.deleteById(id);
  }
}
