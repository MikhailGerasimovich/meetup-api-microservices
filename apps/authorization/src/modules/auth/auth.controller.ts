import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtPayloadDto, JwtType, METADATA, YandexUser } from '@app/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(METADATA.MP_REGISTRATION)
  public async register(@Payload('createUserDto') createUserDto: CreateUserDto): Promise<JwtType> {
    const { accessToken, refreshToken } = await this.authService.register(createUserDto);
    return new JwtType(accessToken, refreshToken);
  }

  @MessagePattern(METADATA.MP_LOCAL_LOGIN)
  public async localLogin(@Payload('user') user: JwtPayloadDto): Promise<JwtType> {
    const { accessToken, refreshToken } = await this.authService.localLogin(user);
    return new JwtType(accessToken, refreshToken);
  }

  @MessagePattern(METADATA.MP_YANDEX_LOGIN)
  async yandexLogin(@Payload('yandexUser') yandexUser: YandexUser) {
    const { accessToken, refreshToken } = await this.authService.yandexLogin(yandexUser);
    return new JwtType(accessToken, refreshToken);
  }

  @MessagePattern(METADATA.MP_LOGOUT)
  public async logout(
    @Payload('jwtPayload') jwtPayload: JwtPayloadDto,
    @Payload('refreshToken') refreshToken: string,
  ): Promise<void> {
    await this.authService.logout(jwtPayload, refreshToken);
  }

  @MessagePattern(METADATA.MP_REFRESH)
  public async refresh(
    @Payload('jwtPayload') jwtPayload: JwtPayloadDto,
    @Payload('refreshToken') oldRefreshToken: string,
  ): Promise<JwtType> {
    const { accessToken, refreshToken } = await this.authService.refresh(jwtPayload, oldRefreshToken);
    return new JwtType(accessToken, refreshToken);
  }

  @MessagePattern(METADATA.MP_VALIDATE_USER)
  public async validateUser(@Payload('email') email: string, @Payload('password') password: string): Promise<JwtPayloadDto> {
    const validate = await this.authService.validateUser(email, password);
    return validate;
  }
}
