import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtPayloadDto, JwtType, METADATA } from '@app/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';
import { UserEntity } from '../user/types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(METADATA.MP_REGISTRATION)
  public async registration(@Payload() createUserDto: CreateUserDto): Promise<JwtType> {
    const tokens = await this.authService.registration(createUserDto);
    return new JwtType(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern(METADATA.MP_LOGIN)
  public async login(@Payload() user: UserEntity): Promise<JwtType> {
    const tokens = await this.authService.login(user);
    return new JwtType(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern(METADATA.MP_LOGOUT)
  public async logout(
    @Payload('userPayload') userPayload: JwtPayloadDto,
    @Payload('refreshToken') refreshToken: string,
  ): Promise<string> {
    await this.authService.logout(userPayload, refreshToken);
    return 'success';
  }

  @MessagePattern(METADATA.MP_REFRESH)
  public async refresh(
    @Payload('userPayload') userPayload: JwtPayloadDto,
    @Payload('refreshToken') refreshToken: string,
  ): Promise<JwtType> {
    const tokens = await this.authService.refresh(userPayload, refreshToken);
    return new JwtType(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern(METADATA.MP_VALIDATE_USER)
  public async validateUser(@Payload('login') login: string, @Payload('password') password: string) {
    const validate = await this.authService.validateUser(login, password);
    return validate;
  }
}
