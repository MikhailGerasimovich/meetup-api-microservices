import { Controller } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserFrontend } from '../user/types/user.frontend';
import { AuthService } from './auth.service';
import { User } from '../user/types/user.entity';
import { JwtType } from './types/jwt.type';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_METADATA } from '../constants/constants';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_METADATA.MP_REGISTRATION)
  public async registration(@Payload() createUserDto: CreateUserDto): Promise<JwtType> {
    const tokens = await this.authService.registration(createUserDto);
    return new JwtType(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern(AUTH_METADATA.MP_REFRESH)
  public async refresh(
    @Payload('userPayload') userPayload: JwtPayloadDto,
    @Payload('refreshToken') refreshToken: string,
  ): Promise<JwtType> {
    const tokens = await this.authService.refresh(userPayload, refreshToken);
    return new JwtType(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern(AUTH_METADATA.MP_LOGIN)
  public async login(@Payload() user: User): Promise<JwtType> {
    const tokens = await this.authService.login(user);
    return new JwtType(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern(AUTH_METADATA.MP_VALIDATE_USER)
  public async validateUser(@Payload('login') login: string, @Payload('password') password: string) {
    const validate = await this.authService.validateUser(login, password);
    return validate;
  }
}
