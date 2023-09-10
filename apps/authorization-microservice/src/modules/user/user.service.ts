import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AvatarDto, ReadAllResult, ROLES } from '@app/common';
import { UserRepository } from './user.repository';
import { IReadAllUserOptions, UserEntity, UserCreationAttrs } from './types';
import { CreateUserDto } from './dto';
import { JwtService } from '../jwt/jwt.service';
import { TransactionClient } from '../../common';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async readAll(readAllOptions: IReadAllUserOptions): Promise<ReadAllResult<UserEntity>> {
    const readAllUser = await this.userRepository.readAll(readAllOptions);
    return readAllUser;
  }

  async readById(id: number, selectFields?: string[], transaction?: TransactionClient): Promise<UserEntity> {
    const user = await this.userRepository.readById(id, selectFields, transaction);
    return user;
  }

  async readByEmail(email: string, selectFields?: string[], transaction?: TransactionClient): Promise<UserEntity> {
    const user = await this.userRepository.readByEmail(email, selectFields, transaction);
    return user;
  }

  async create(
    createUserDto: CreateUserDto,
    provider: string,
    selectFields?: string[],
    transaction?: TransactionClient,
  ): Promise<UserEntity> {
    const userCreationAttrs: UserCreationAttrs = {
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
      provider,
      role: ROLES.USER,
    };

    const createdUser = await this.userRepository.create(userCreationAttrs, selectFields, transaction);
    return createdUser;
  }

  async deleteById(id: number, selectFields?: string[], transaction?: TransactionClient): Promise<void> {
    const existingUser = await this.userRepository.readById(id, selectFields, transaction);
    if (!existingUser) {
      throw new RpcException({ message: `The specified user does not exist`, statusCode: HttpStatus.BAD_REQUEST });
    }

    await this.jwtService.deleteAllUserJwt(id, transaction);
    await this.userRepository.deleteById(id, transaction);
  }

  async uploadAvatar(id: number, filename: string): Promise<AvatarDto> {
    const selectFields = ['avatarFilename'];
    const user = await this.userRepository.readById(id, selectFields);

    const oldAvatarFilename = user.avatarFilename;
    const avatarDto: AvatarDto = { avatarFilename: filename };
    if (oldAvatarFilename) {
      avatarDto.hasOldAvatar = true;
      avatarDto.oldAvatarFilename = oldAvatarFilename;
    }

    await this.userRepository.uploadAvatar(id, filename);
    return avatarDto;
  }

  async downloadAvatar(id: number): Promise<AvatarDto> {
    const avatarFilename = await this.userRepository.downloadAvatar(id);
    if (!avatarFilename) {
      throw new RpcException({ message: `No avatars to download`, statusCode: HttpStatus.BAD_REQUEST });
    }

    const avatarDto: AvatarDto = { avatarFilename: avatarFilename };
    return avatarDto;
  }

  async removeAvatar(id: number): Promise<AvatarDto> {
    const selectFields = ['avatarFilename'];
    const user = await this.userRepository.readById(id, selectFields);
    const avatarFilename = user.avatarFilename;
    if (!avatarFilename) {
      throw new RpcException({ message: `No avatars to remove`, statusCode: HttpStatus.BAD_REQUEST });
    }
    await this.userRepository.removeAvatar(id);
    const avatarDto: AvatarDto = {
      avatarFilename: avatarFilename,
    };
    return avatarDto;
  }
}
