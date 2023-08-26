import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GatewayAuthService } from './gateway-auth.service';
import { JoiValidationPipe, LocalAuthGuard, UserFromRequest } from '@app/common';
import { RegistrationUserSchema } from './schemas/regiastration-user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './types/user.entity';
import { Request, Response } from 'express';
import { JwtType } from './types/jwt.type';
import { RefreshGuard } from '@app/common/guards/refresh.guard';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Controller('auth')
export class GatewayAuthController {
  constructor(private readonly gatewayAuthService: GatewayAuthService) {}

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
  public async login(@UserFromRequest() user: User, @Res({ passthrough: true }) res: Response): Promise<JwtType> {
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
