import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ReadAllResult, ROLES } from '@app/common';
import { UserRepository } from './user.repository';
import { IReadAllUserOptions, UserEntity, UserCreationAttrs } from './types';
import { CreateUserDto } from './dto';
import { JwtService } from '../jwt/jwt.service';

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

  async readById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.readById(id);
    return user;
  }

  async readByLogin(login: string, requiredFields?: string[]): Promise<UserEntity> {
    const user = await this.userRepository.readByLogin(login, requiredFields);
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userCreationAttrs: UserCreationAttrs = {
      login: createUserDto.login,
      email: createUserDto.email,
      password: createUserDto.password,
      role: ROLES.USER,
    };
    const createdUser = await this.userRepository.create(userCreationAttrs);
    return createdUser;
  }

  async deleteById(id: number): Promise<void> {
    const existingUser = await this.userRepository.readById(id);
    if (!existingUser) {
      throw new RpcException({ message: `The specified user does not exist`, statusCode: HttpStatus.BAD_REQUEST });
    }

    await this.jwtService.deleteAllUserJwt(id);
    await this.userRepository.deleteById(id);
  }
}
