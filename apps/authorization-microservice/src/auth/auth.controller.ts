import { Controller } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserFrontend } from '../user/types/user.frontend';
import { AuthService } from './auth.service';
import { User } from '../user/types/user.entity';
import { JwtFrontend } from './types/jwt.frontend';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_METADATA } from '../constants/constants';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_METADATA.MP_REGISTRATION)
  public async registration(@Payload() createUserDto: CreateUserDto): Promise<UserFrontend> {
    const registeredUser = await this.authService.registration(createUserDto);
    return new UserFrontend(registeredUser);
  }

  @MessagePattern(AUTH_METADATA.MP_LOGIN)
  public async login(@Payload() user: User): Promise<JwtFrontend> {
    const tokens = await this.authService.login(user);
    return new JwtFrontend(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern(AUTH_METADATA.MP_VALIDATE_USER)
  public async validateUser(@Payload('login') login: string, @Payload('password') password: string) {
    const validate = await this.authService.validateUser(login, password);
    return validate;
  }
}
