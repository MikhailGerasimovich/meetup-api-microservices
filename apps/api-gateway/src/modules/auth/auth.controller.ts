import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtPayloadDto } from '@app/common';
import { Request, Response } from 'express';
import {
  JoiValidationPipe,
  JwtAuthGuard,
  LocalAuthGuard,
  RefreshGuard,
  UserFromRequest,
  setAuthCookie,
} from '../../common';
import { RegistrationUserSchema } from './schemas';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { UserEntity } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  public async registration(
    @Body(new JoiValidationPipe(RegistrationUserSchema)) createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.registration(createUserDto);
    setAuthCookie(res, tokens);
    return;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@UserFromRequest() user: UserEntity, @Res({ passthrough: true }) res: Response): Promise<void> {
    const tokens = await this.authService.login(user);
    setAuthCookie(res, tokens);
    return;
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
