import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT } from '../../../constants/constants';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { GatewayUserService } from '../../user/gateway-user.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private gatewayUserService: GatewayUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const data = request?.cookies['auth-cookie'];
          if (!data) {
            return null;
          }
          return data.refreshToken;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: JWT.REFRESH_SECRET,
    });
  }

  async validate(payload: JwtPayloadDto) {
    if (!payload) {
      throw new BadRequestException('missing refresh jwt');
    }
    const user = await this.gatewayUserService.readById(String(payload.id));
    return user;
  }
}
