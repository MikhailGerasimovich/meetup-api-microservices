import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DownloadedFile } from 'easy-yandex-s3/types/EasyYandexS3';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayloadDto, METADATA, ReadAllResult } from '@app/common';
import { AUTH_MICROSERVICE, sendMessage } from '../../common';
import { IReadAllUserOptions, UserType } from './types';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(AUTH_MICROSERVICE.RMQ_CLIENT_NAME) private readonly client: ClientProxy,
    private readonly awsService: AwsService,
  ) {}

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

  async uploadAvatar(jwtPayload: JwtPayloadDto, file: Express.Multer.File): Promise<void> {
    console.log(file);

    // const filename = `${uuidv4()}${extname(file.originalname)}`;
    // const up = await this.awsService.upload(file);
    // console.log(filename);
  }

  async downloadAvatar(jwtPayload: JwtPayloadDto): Promise<DownloadedFile> {
    return null;
  }

  async removeAvatar(jwtPayload: JwtPayloadDto): Promise<void> {}
}
