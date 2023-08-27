import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtPayloadDto, JwtType } from '@app/common';
import { Request, Response } from 'express';
import { JoiValidationPipe, LocalAuthGuard, RefreshGuard, UserFromRequest } from '../../common';
import { RegistrationUserSchema } from './schemas';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { UserEntity } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly gatewayAuthService: AuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  public async registration(
    @Body(new JoiValidationPipe(RegistrationUserSchema)) createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtType> {
    const tokens = await this.gatewayAuthService.registration(createUserDto);
    res.cookie('auth-cookie', tokens, { httpOnly: true });
    return tokens;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@UserFromRequest() user: UserEntity, @Res({ passthrough: true }) res: Response): Promise<JwtType> {
    const tokens = await this.gatewayAuthService.login(user);
    res.cookie('auth-cookie', tokens, { httpOnly: true });
    return tokens;
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @UserFromRequest() userPayload: JwtPayloadDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtType> {
    const { refreshToken } = req?.cookies['auth-cookie'];
    const tokens = await this.gatewayAuthService.refresh(userPayload, refreshToken);
    res.cookie('auth-cookie', tokens, { httpOnly: true });
    return tokens;
  }
}
