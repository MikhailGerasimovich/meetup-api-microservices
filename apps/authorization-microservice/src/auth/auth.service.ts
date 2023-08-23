import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/types/user.entity';
import { compareSync, hash } from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtFrontend } from './types/jwt.type';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(login: string, password: string): Promise<User> {
    const candidate = await this.userService.readByLogin(login);
    if (candidate && compareSync(password, candidate.password)) {
      return candidate;
    }

    throw new BadRequestException('wrong login or password');
  }

  public async registration(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await hash(createUserDto.password, 10);
    const registratedUser = await this.userService.create({
      ...createUserDto,
      password: hashPassword,
    });
    return registratedUser;
  }

  public async login(user: User): Promise<JwtFrontend> {
    const payload = { id: user.id, roles: user.roles };

    const accessToken = await this.generateAccessJwt(payload);
    const refreshToken = await this.generateRefreshJwt(payload);

    return { accessToken, refreshToken };
  }

  private async generateAccessJwt(payload: PayloadDto): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: 'secret',
      expiresIn: '12h',
    });

    return accessToken;
  }

  private async generateRefreshJwt(payload: PayloadDto): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'secret',
      expiresIn: '12h',
    });

    return refreshToken;
  }
}
