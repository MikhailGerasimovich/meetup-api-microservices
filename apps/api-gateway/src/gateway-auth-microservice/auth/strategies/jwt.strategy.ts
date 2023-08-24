import { Injectable } from '@nestjs/common/decorators';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayloadDto } from 'apps/authorization-microservice/src/auth/dto/jwt-payload.dto';
import { JWT } from '../../../constants/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          let data = request?.cookies['auth-cookie'];
          if (!data) {
            return null;
          }
          return data.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT.ACCESS_SECRET,
    });
  }

  public async validate(payload: JwtPayloadDto) {
    if (!payload) {
      throw new UnauthorizedException('missing access jwt');
    }
    return payload;
  }
}
