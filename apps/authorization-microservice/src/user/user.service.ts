import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { UserCreationAttrs } from './types/user.creation-attrs';
import { IReadAllUserOptions } from './types/read-all-user.options';
import { ReadAllResult } from '@app/common';
import { User } from './types/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RpcException } from '@nestjs/microservices';
import { UserUpdateAttrs } from './types/user.update-attrs';
import { ROLES_NAME } from '../constants/constants';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async readAll(readAllOptions: IReadAllUserOptions): Promise<ReadAllResult<User>> {
    const readAllUser = await this.userRepository.readAll(readAllOptions);
    return readAllUser;
  }

  async readById(id: string): Promise<User> {
    const user = await this.userRepository.readById(id);
    return user;
  }

  async readByLogin(login: string, requiredFields?: string[]): Promise<User> {
    const user = await this.userRepository.readByLogin(login, requiredFields);
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userCreationAttrs: UserCreationAttrs = {
      login: createUserDto.login,
      email: createUserDto.email,
      password: createUserDto.password,
      roles: [ROLES_NAME.USER],
    };
    const createdUser = await this.userRepository.create(userCreationAttrs);
    return createdUser;
  }

  async deleteById(id: string): Promise<void> {
    const existingUser = await this.userRepository.readById(id);
    if (!existingUser) {
      throw new RpcException({ message: `The specified user does not exist`, statusCode: HttpStatus.BAD_REQUEST });
    }

    await this.userRepository.deleteById(id);
  }
}
