import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { GatewayAuthService } from './gateway-auth.service';
import { JoiValidationPipe, LocalAuthGuard, UserFromRequest } from '@app/common';
import { RegistrationUserSchema } from './schemas/regiastration-user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFrontend } from './types/user.frontend';
import { User } from './types/user.entity';
import { Request } from 'express';
import { JwtFrontend } from './types/jwt.frontend';

@Controller('auth')
export class GatewayAuthController {
  constructor(private readonly gatewayAuthService: GatewayAuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  public async registration(
    @Body(new JoiValidationPipe(RegistrationUserSchema)) createUserDto: CreateUserDto,
  ): Promise<UserFrontend> {
    console.log(createUserDto);

    const registeredUser = await this.gatewayAuthService.registration(createUserDto);
    return new UserFrontend(registeredUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@UserFromRequest() user: User, @Req() req: Request): Promise<JwtFrontend> {
    const tokens = await this.gatewayAuthService.login(user);
    req.res.cookie('auth-cookie', tokens, { httpOnly: true });
    return tokens;
  }
}
