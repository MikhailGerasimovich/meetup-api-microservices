import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtPayloadDto, YandexUser } from '@app/common';
import { Request, Response } from 'express';
import {
  JoiValidationPipe,
  JwtAuthGuard,
  LocalAuthGuard,
  RefreshGuard,
  UserFromRequest,
  YandexAuthGuard,
  setAuthCookie,
} from '../../common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { UserEntity } from './types';
import { LocalRegistrationSchema, YandexLoginSchema } from './schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  public async registration(
    @Body(new JoiValidationPipe(LocalRegistrationSchema)) createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.registration(createUserDto);
    setAuthCookie(res, tokens);
    return;
  }

  @UseGuards(LocalAuthGuard)
  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  public async localLogin(
    @UserFromRequest() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.localLogin(user);
    setAuthCookie(res, tokens);
    return;
  }

  @UseGuards(YandexAuthGuard)
  @Get('yandex/login')
  @HttpCode(HttpStatus.OK)
  async yandexLoginCallback(
    @UserFromRequest(new JoiValidationPipe(YandexLoginSchema)) yandexUser: YandexUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const tokens = await this.authService.yandexLogin(yandexUser);
    setAuthCookie(res, tokens);
    return 'yandex user login';
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @UserFromRequest() userPayload: JwtPayloadDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { refreshToken } = req?.cookies['auth-cookie'];
    await this.authService.logout(userPayload, refreshToken);
    setAuthCookie(res, null);
    return;
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @UserFromRequest() userPayload: JwtPayloadDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { refreshToken } = req?.cookies['auth-cookie'];
    const tokens = await this.authService.refresh(userPayload, refreshToken);
    setAuthCookie(res, tokens);
    return;
  }
}
