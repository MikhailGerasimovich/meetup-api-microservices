import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AvatarDto, METADATA, ReadAllResult } from '@app/common';
import { UserService } from './user.service';
import { IReadAllUserOptions, UserType } from './types';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(METADATA.MP_GET_ALL_USERS)
  async readAll(@Payload('readAllUserOptions') readAllUserOptions: IReadAllUserOptions): Promise<ReadAllResult<UserType>> {
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

  @MessagePattern(METADATA.MP_DELETE_USER_BY_ID)
  async deleteById(@Payload('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.deleteById(id);
  }

  @MessagePattern(METADATA.MP_UPLOAD_AVATAR)
  async uploadAvatar(@Payload('id', ParseIntPipe) id: number, @Payload('filename') filename: string): Promise<AvatarDto> {
    const avatarDto = await this.userService.uploadAvatar(id, filename);
    return avatarDto;
  }

  @MessagePattern(METADATA.MP_DOWNLOAD_AVATAR)
  async downloadAvatar(@Payload('id', ParseIntPipe) id: number): Promise<AvatarDto> {
    const avatarDto = await this.userService.downloadAvatar(id);
    return avatarDto;
  }

  @MessagePattern(METADATA.MP_REMOVE_AVATAR)
  async removeAvatar(@Payload('id', ParseIntPipe) id: number) {
    const avatarDto = await this.userService.removeAvatar(id);
    return avatarDto;
  }
}
