import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { GatewayAuthService } from '../gateway-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private gatewayAuthService: GatewayAuthService) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

  async validate(login: string, password: string) {
    const user = await this.gatewayAuthService.validateUser(login, password);
    return user;
  }
}
