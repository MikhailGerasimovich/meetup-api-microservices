import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { JwtPayloadDto, YandexUser } from '@app/common';
import { Response } from 'express';
import {
  JoiValidationPipe,
  JwtAuthGuard,
  LocalAuthGuard,
  RefreshGuard,
  TokensFromRequest,
  UserFromRequest,
  YandexAuthGuard,
  setAuthCookie,
} from '../../common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { UserEntity } from './types';
import { LocalRegistrationSchema, YandexLoginSchema } from './schemas';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User successfully registered' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  public async register(
    @Body(new JoiValidationPipe(LocalRegistrationSchema)) createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.register(createUserDto);
    setAuthCookie(res, tokens);
  }

  @UseGuards(LocalAuthGuard)
  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login using email and password',
    requestBody: {
      description: 'Information required to login',
      required: true,
      content: { ['application/json']: { example: { email: 'user@mail.ru', password: 'password_user' } } },
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'User successfully login' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  public async localLogin(@UserFromRequest() user: UserEntity, @Res({ passthrough: true }) res: Response): Promise<void> {
    const tokens = await this.authService.localLogin(user);
    setAuthCookie(res, tokens);
  }

  @UseGuards(YandexAuthGuard)
  @Get('yandex/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Yandex login' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Successfully login' })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User successfully logged out' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  public async logout(
    @UserFromRequest() userPayload: JwtPayloadDto,
    @TokensFromRequest('refreshToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(userPayload, token);
    setAuthCookie(res, null);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tokens successfully refreshed' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  public async refresh(
    @UserFromRequest() userPayload: JwtPayloadDto,
    @TokensFromRequest('refreshToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.refresh(userPayload, token);
    setAuthCookie(res, tokens);
  }
}
