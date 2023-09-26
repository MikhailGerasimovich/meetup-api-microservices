import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtPayloadDto, JwtType, METADATA, YandexUser } from '@app/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(METADATA.MP_REGISTRATION)
  public async registration(@Payload('createUserDto') createUserDto: CreateUserDto): Promise<JwtType> {
    const tokens = await this.authService.registration(createUserDto);
    return new JwtType(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern(METADATA.MP_LOCAL_LOGIN)
  public async localLogin(@Payload('user') user: JwtPayloadDto): Promise<JwtType> {
    const tokens = await this.authService.localLogin(user);
    return new JwtType(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern(METADATA.MP_YANDEX_LOGIN)
  async yandexLogin(@Payload() yandexUser: YandexUser) {
    const tokens = await this.authService.yandexLogin(yandexUser);
    return new JwtType(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern(METADATA.MP_LOGOUT)
  public async logout(
    @Payload('jwtPayload') jwtPayload: JwtPayloadDto,
    @Payload('refreshToken') refreshToken: string,
  ): Promise<string> {
    await this.authService.logout(jwtPayload, refreshToken);
    return 'success';
  }

  @MessagePattern(METADATA.MP_REFRESH)
  public async refresh(
    @Payload('jwtPayload') jwtPayload: JwtPayloadDto,
    @Payload('refreshToken') refreshToken: string,
  ): Promise<JwtType> {
    const tokens = await this.authService.refresh(jwtPayload, refreshToken);
    return new JwtType(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern(METADATA.MP_VALIDATE_USER)
  public async validateUser(
    @Payload('email') email: string,
    @Payload('password') password: string,
  ): Promise<JwtPayloadDto> {
    const validate = await this.authService.validateUser(email, password);
    return validate;
  }
}
