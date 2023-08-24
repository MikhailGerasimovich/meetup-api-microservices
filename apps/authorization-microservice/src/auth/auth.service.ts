import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/types/user.entity';
import { compareSync, hash } from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtFrontend } from './types/jwt.frontend';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { RpcException } from '@nestjs/microservices';
import { JWT } from '../constants/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(login: string, password: string): Promise<JwtPayloadDto> {
    const candidate = await this.userService.readByLogin(login, ['password', 'roles']);

    if (candidate && compareSync(password, candidate.password)) {
      return { id: candidate.id, roles: candidate.roles };
    }

    throw new RpcException({ message: 'wrong login or password', statusCode: HttpStatus.BAD_REQUEST });
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

  private async generateAccessJwt(payload: JwtPayloadDto): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT.ACCESS_SECRET,
      expiresIn: JWT.ACCESS_DURATION,
    });

    return accessToken;
  }

  private async generateRefreshJwt(payload: JwtPayloadDto): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: JWT.REFRESH_SECRET,
      expiresIn: JWT.REFRESH_DURATION,
    });

    return refreshToken;
  }
}
