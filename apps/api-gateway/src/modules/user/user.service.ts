import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { DownloadedFile } from 'easy-yandex-s3/types/EasyYandexS3';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { AvatarDto, JwtPayloadDto, METADATA, ReadAllResult } from '@app/common';
import { AUTH, sendMessage } from '../../common';
import { IReadAllUserOptions, UserType } from './types';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(AUTH.RMQ_CLIENT_NAME) private readonly client: ClientProxy,
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
  ) {}

  async readAll(readAllUserOptions: IReadAllUserOptions): Promise<ReadAllResult<UserType>> {
    const users = await this.sendMessageToUserClient<ReadAllResult<UserType>>(METADATA.MP_GET_ALL_USERS, { readAllUserOptions });
    return users;
  }

  async readById(id: number): Promise<UserType> {
    const user = await this.sendMessageToUserClient<UserType>(METADATA.MP_GET_USER_BY_ID, { id });
    return user;
  }

  async deleteById(id: number): Promise<void> {
    await this.sendMessageToUserClient<void>(METADATA.MP_DELETE_USER_BY_ID, { id });
  }

  async uploadAvatar(jwtPayload: JwtPayloadDto, file: Express.Multer.File): Promise<void> {
    const filename = `${uuidv4()}${extname(file.originalname)}`;
    const isUpload = await this.awsService.upload(file, filename);
    if (!isUpload) {
      throw new BadGatewayException('Failed to upload image to server');
    }

    const avatarDto: AvatarDto = await this.sendMessageToUserClient<AvatarDto>(METADATA.MP_UPLOAD_AVATAR, {
      id: jwtPayload.id,
      filename,
    });

    if (avatarDto.hasOldAvatar) {
      const folder = this.configService.get<string>('AVATAR_FOLDER_NAME');
      await this.awsService.remove(folder, avatarDto.oldAvatarFilename);
    }
  }

  async downloadAvatar(id: number): Promise<DownloadedFile> {
    const avatarDto: AvatarDto = await this.sendMessageToUserClient<AvatarDto>(METADATA.MP_DOWNLOAD_AVATAR, { id });
    const folder = this.configService.get<string>('AVATAR_FOLDER_NAME');
    const file = await this.awsService.download(folder, avatarDto.avatarFilename);
    if (!file) {
      throw new BadGatewayException('Failed to download image from server');
    }
    return file;
  }

  async removeAvatar(jwtPayload: JwtPayloadDto): Promise<void> {
    const avatarDto: AvatarDto = await this.sendMessageToUserClient<AvatarDto>(METADATA.MP_REMOVE_AVATAR, { id: jwtPayload.id });
    const folder = this.configService.get<string>('AVATAR_FOLDER_NAME');
    const isRemoved = await this.awsService.remove(folder, avatarDto.avatarFilename);
    if (!isRemoved) {
      throw new BadGatewayException('Failed to remove image from server');
    }
  }

  private async sendMessageToUserClient<T>(metadata: string, data: any): Promise<T> {
    const res = await sendMessage<T>({ client: this.client, metadata, data });
    return res;
  }
}
