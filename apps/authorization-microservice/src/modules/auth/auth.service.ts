import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { compareSync, hash } from 'bcryptjs';
import { JwtPayloadDto, JwtType, YandexUser } from '@app/common';
import { JwtService } from '../jwt/jwt.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';
import { UserEntity } from '../user/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(supposedEmail: string, supposedPassword: string): Promise<JwtPayloadDto> {
    const selectFields = ['password', 'role', 'provider'];
    const candidate = await this.userService.readByEmail(supposedEmail, selectFields);
    const { id, role, password, provider } = candidate;
    if (candidate && provider == 'local' && compareSync(supposedPassword, password)) {
      return { id, role };
    }

    throw new RpcException({ message: 'wrong login or password', statusCode: HttpStatus.BAD_REQUEST });
  }

  async registration(createUserDto: CreateUserDto): Promise<JwtType> {
    const registratedUser = await this.createLocalUser(createUserDto);
    const { id, role } = registratedUser;
    const tokens = await this.loginUser(id, role);
    return tokens;
  }

  async localLogin(user: JwtPayloadDto): Promise<JwtType> {
    const { id, role } = user;
    const tokens = await this.loginUser(id, role);
    return tokens;
  }

  async yandexLogin(yandexUser: YandexUser) {
    const selectFields = ['role'];
    const { email } = yandexUser;
    let user = await this.userService.readByEmail(email, selectFields);
    if (!user) {
      user = await this.createYandexUser(yandexUser);
    }

    const { id, role } = user;
    const tokens = await this.loginUser(id, role);
    return tokens;
  }

  async logout(jwtPayload: JwtPayloadDto, refreshToken: string): Promise<void> {
    await this.jwtService.deleteJwt(jwtPayload.id, refreshToken);
  }

  async refresh(jwtPayload: JwtPayloadDto, refreshToken: string): Promise<JwtType> {
    const { id, role } = jwtPayload;
    const token = await this.jwtService.readJwt(id, refreshToken);
    if (!token) {
      await this.jwtService.deleteAllUserJwt(id);
      throw new RpcException({ message: 'Need to login', statusCode: HttpStatus.UNAUTHORIZED });
    }

    const isValidToken = await this.jwtService.isValidRefreshJwt(token);
    if (!isValidToken) {
      await this.jwtService.deleteJwt(id, refreshToken);
      throw new RpcException({ message: 'Need to login', statusCode: HttpStatus.UNAUTHORIZED });
    }

    await this.jwtService.deleteJwt(id, refreshToken);
    const tokens = await this.loginUser(id, role);
    return tokens;
  }

  private async loginUser(id: number, role: string): Promise<JwtType> {
    const payload = { id, role };
    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);
    await this.jwtService.saveJwt(id, refreshToken);

    return { accessToken, refreshToken };
  }

  private async createLocalUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const selectFields = ['role'];
    const provider = 'local';
    const hashPassword = await hash(createUserDto.password, 10);
    const user = { ...createUserDto, password: hashPassword };
    const registratedUser = await this.userService.create(user, provider, selectFields);
    return registratedUser;
  }

  private async createYandexUser(yandexUser: YandexUser): Promise<UserEntity> {
    const { username, email } = yandexUser;
    const selectFields = ['role'];
    const provider = 'yandex';
    const user: CreateUserDto = {
      username,
      email,
      password: null,
    };

    const registratedUser = await this.userService.create(user, provider, selectFields);
    return registratedUser;
  }
}
