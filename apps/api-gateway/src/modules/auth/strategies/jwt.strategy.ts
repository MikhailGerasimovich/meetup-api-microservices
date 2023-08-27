import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from '@app/common';
import { JWT } from '../../../common';

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
