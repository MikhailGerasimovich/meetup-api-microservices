import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtPayloadDto, JwtType, METADATA } from '@app/common';
import { AUTH_MICROSERVICE, sendMessage } from '../../common';
import { CreateUserDto } from './dto';
import { UserEntity } from './types';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_MICROSERVICE.RMQ_CLIENT_NAME) private readonly client: ClientProxy) {}

  public async registration(createUserDto: CreateUserDto): Promise<JwtType> {
    const user = await sendMessage<JwtType>({
      client: this.client,
      metadata: METADATA.MP_REGISTRATION,
      data: createUserDto,
    });

    return user;
  }

  public async login(user: UserEntity): Promise<JwtType> {
    const tokens = await sendMessage<JwtType>({
      client: this.client,
      metadata: METADATA.MP_LOGIN,
      data: user,
    });

    return tokens;
  }

  public async logout(userPayload: JwtPayloadDto, refreshToken: string): Promise<void> {
    await sendMessage({
      client: this.client,
      metadata: METADATA.MP_LOGOUT,
      data: { userPayload, refreshToken },
    });
  }

  public async refresh(userPayload: JwtPayloadDto, refreshToken: string): Promise<JwtType> {
    const tokens = await sendMessage<JwtType>({
      client: this.client,
      metadata: METADATA.MP_REFRESH,
      data: { userPayload, refreshToken },
    });

    return tokens;
  }

  public async validateUser(login: string, password: string): Promise<UserEntity> {
    const validate = await sendMessage<UserEntity>({
      client: this.client,
      metadata: METADATA.MP_VALIDATE_USER,
      data: { login, password },
    });

    return validate;
  }
}
