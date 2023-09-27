import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtPayloadDto, JwtType, METADATA, YandexUser } from '@app/common';
import { AUTH, sendMessage } from '../../common';
import { CreateUserDto } from './dto';
import { UserEntity } from './types';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH.RMQ_CLIENT_NAME) private readonly client: ClientProxy) {}

  async register(createUserDto: CreateUserDto): Promise<JwtType> {
    const user = await this.sendMessageToAuthClient<JwtType>(METADATA.MP_REGISTRATION, { createUserDto });
    return user;
  }

  async localLogin(user: UserEntity): Promise<JwtType> {
    const tokens = await this.sendMessageToAuthClient<JwtType>(METADATA.MP_LOCAL_LOGIN, { user });
    return tokens;
  }

  async yandexLogin(yandexUser: YandexUser): Promise<JwtType> {
    const tokens = await this.sendMessageToAuthClient<JwtType>(METADATA.MP_YANDEX_LOGIN, { yandexUser });
    return tokens;
  }

  async logout(jwtPayload: JwtPayloadDto, refreshToken: string): Promise<void> {
    await this.sendMessageToAuthClient(METADATA.MP_LOGOUT, { jwtPayload, refreshToken });
  }

  async refresh(jwtPayload: JwtPayloadDto, refreshToken: string): Promise<JwtType> {
    const tokens = await this.sendMessageToAuthClient<JwtType>(METADATA.MP_REFRESH, { jwtPayload, refreshToken });
    return tokens;
  }

  async validateUser(email: string, password: string): Promise<JwtPayloadDto> {
    const validate = await this.sendMessageToAuthClient<JwtPayloadDto>(METADATA.MP_VALIDATE_USER, { email, password });
    return validate;
  }

  private async sendMessageToAuthClient<T>(metadata: string, data: any): Promise<T> {
    const res = await sendMessage<T>({ client: this.client, metadata, data });
    return res;
  }
}
