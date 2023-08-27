import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtPayloadDto, JwtType, METADATA } from '@app/common';
import { AUTH_MICROSERVICE } from '../../common';
import { CreateUserDto } from './dto';
import { UserEntity } from './types';
@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_MICROSERVICE.RMQ_CLIENT_NAME) private readonly client: ClientProxy) {}

  public async registration(createUserDto: CreateUserDto): Promise<JwtType> {
    const user = await firstValueFrom(this.client.send(METADATA.MP_REGISTRATION, createUserDto));
    return user;
  }

  public async login(user: UserEntity): Promise<JwtType> {
    const tokens = await firstValueFrom(this.client.send(METADATA.MP_LOGIN, user));
    return tokens;
  }

  public async refresh(userPayload: JwtPayloadDto, refreshToken: string): Promise<JwtType> {
    const tokens = await firstValueFrom(this.client.send(METADATA.MP_REFRESH, { userPayload, refreshToken }));
    return tokens;
  }

  public async validateUser(login: string, password: string): Promise<UserEntity> {
    const validate = await firstValueFrom(this.client.send(METADATA.MP_VALIDATE_USER, { login, password }));
    return validate;
  }
}
