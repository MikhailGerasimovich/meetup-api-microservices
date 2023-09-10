import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtPayloadDto, JwtType, METADATA, YandexUser } from '@app/common';
import { AUTH, sendMessage } from '../../common';
import { CreateUserDto } from './dto';
import { UserEntity } from './types';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH.RMQ_CLIENT_NAME) private readonly client: ClientProxy) {}

  async registration(createUserDto: CreateUserDto): Promise<JwtType> {
    const user = await sendMessage<JwtType>({
      client: this.client,
      metadata: METADATA.MP_REGISTRATION,
      data: { createUserDto },
    });

    return user;
  }

  async localLogin(user: UserEntity): Promise<JwtType> {
    const tokens = await sendMessage<JwtType>({
      client: this.client,
      metadata: METADATA.MP_LOCAL_LOGIN,
      data: { user },
    });

    return tokens;
  }

  async yandexLogin(yandexUser: YandexUser): Promise<JwtType> {
    const tokens = await sendMessage<JwtType>({
      client: this.client,
      metadata: METADATA.MP_YANDEX_LOGIN,
      data: yandexUser,
    });
    return tokens;
  }

  async logout(jwtPayload: JwtPayloadDto, refreshToken: string): Promise<void> {
    await sendMessage({
      client: this.client,
      metadata: METADATA.MP_LOGOUT,
      data: { jwtPayload, refreshToken },
    });
  }

  async refresh(jwtPayload: JwtPayloadDto, refreshToken: string): Promise<JwtType> {
    const tokens = await sendMessage<JwtType>({
      client: this.client,
      metadata: METADATA.MP_REFRESH,
      data: { jwtPayload, refreshToken },
    });

    return tokens;
  }

  async validateUser(email: string, password: string): Promise<JwtPayloadDto> {
    const validate = await sendMessage<JwtPayloadDto>({
      client: this.client,
      metadata: METADATA.MP_VALIDATE_USER,
      data: { email, password },
    });

    return validate;
  }
}
