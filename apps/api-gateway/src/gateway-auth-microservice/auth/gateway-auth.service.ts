import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_MICROSERVICE, METADATA } from '../../constants/gateway-auth.constants';
import { User } from './types/user.entity';
import { JwtFrontend } from './types/jwt.frontend';
import { CreateUserDto } from './dto/create-user.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GatewayAuthService {
  constructor(@Inject(AUTH_MICROSERVICE.RMQ_CLIENT_NAME) private readonly client: ClientProxy) {}

  public async registration(createUserDto: CreateUserDto): Promise<User> {
    const user = await firstValueFrom(this.client.send(METADATA.MP_REGISTRATION, createUserDto));
    return user;
  }

  public async login(user: User): Promise<JwtFrontend> {
    const tokens = await firstValueFrom(this.client.send(METADATA.MP_LOGIN, user));
    return tokens;
  }

  public async validateUser(login: string, password: string): Promise<User> {
    const validate = await firstValueFrom(this.client.send(METADATA.MP_VALIDATE_USER, { login, password }));
    return validate;
  }
}
