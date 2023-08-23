import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserFrontend } from '../user/types/user.frontend';
import { AuthService } from './auth.service';
import { CreateUserSchema } from '../user/schemas/create-user.schema';
import { JoiValidationPipe, UserFromRequest } from '@app/common';
import { LocalAuthGuard } from '@app/common/guards/local.guard';
import { User } from '../user/types/user.entity';
import { JwtFrontend } from './types/jwt.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  public async registration(
    @Body(new JoiValidationPipe(CreateUserSchema)) createUserDto: CreateUserDto,
  ): Promise<UserFrontend> {
    const registeredUser = await this.authService.registration(createUserDto);
    return new UserFrontend(registeredUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@UserFromRequest() user: User, @Req() req: Request): Promise<JwtFrontend> {
    console.log(user);

    const tokens = await this.authService.login(user);
    req.res.cookie('auth-cookie', tokens, { httpOnly: true });
    return tokens;
  }
}
