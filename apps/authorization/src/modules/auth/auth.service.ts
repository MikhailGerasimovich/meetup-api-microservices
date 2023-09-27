import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { compareSync, hash } from 'bcryptjs';
import { JwtPayloadDto, JwtType, YandexUser } from '@app/common';
import { JwtService } from '../jwt/jwt.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';
import { UserEntity } from '../user/types';
import { TransactionClient } from '../../common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(supposedEmail: string, pass: string): Promise<JwtPayloadDto> {
    const selectFields = ['password', 'role', 'provider'];
    const candidate = await this.userService.readByEmail(supposedEmail, selectFields);
    const { id, role, password, provider } = candidate;
    if (candidate && provider == 'local' && compareSync(pass, password)) {
      return { id, role };
    }

    throw new RpcException({ message: 'wrong login or password', statusCode: HttpStatus.BAD_REQUEST });
  }

  async register(createUserDto: CreateUserDto): Promise<JwtType> {
    const transactionResult = await this.prisma.$transaction(async (transaction: TransactionClient) => {
      const registratedUser = await this.createLocalUser(createUserDto, transaction);
      const { id, role } = registratedUser;
      const tokens = await this.loginUser(id, role, transaction);
      return tokens;
    });
    return transactionResult;
  }

  async localLogin(user: JwtPayloadDto): Promise<JwtType> {
    const { id, role } = user;
    const tokens = await this.loginUser(id, role);
    return tokens;
  }

  async yandexLogin(yandexUser: YandexUser) {
    const transactionResult = await this.prisma.$transaction(async (transaction: TransactionClient) => {
      const selectFields = ['role'];
      const { email } = yandexUser;
      let user = await this.userService.readByEmail(email, selectFields, transaction);
      if (!user) {
        user = await this.createYandexUser(yandexUser, transaction);
      }

      const { id, role } = user;
      const tokens = await this.loginUser(id, role, transaction);
      return tokens;
    });
    return transactionResult;
  }

  async logout(jwtPayload: JwtPayloadDto, refreshToken: string): Promise<void> {
    await this.jwtService.deleteJwt(jwtPayload.id, refreshToken);
  }

  async refresh(jwtPayload: JwtPayloadDto, refreshToken: string): Promise<JwtType> {
    const transactionResult = await this.prisma.$transaction(async (transaction: TransactionClient) => {
      const { id, role } = jwtPayload;
      const token = await this.jwtService.readJwt(id, refreshToken, transaction);
      if (!token) {
        await this.jwtService.deleteAllUserJwt(id, transaction);
        throw new RpcException({ message: 'Need to login', statusCode: HttpStatus.UNAUTHORIZED });
      }

      const isValidToken = await this.jwtService.isValidRefreshJwt(token);
      if (!isValidToken) {
        await this.jwtService.deleteJwt(id, refreshToken, transaction);
        throw new RpcException({ message: 'Need to login', statusCode: HttpStatus.UNAUTHORIZED });
      }

      await this.jwtService.deleteJwt(id, refreshToken, transaction);
      const tokens = await this.loginUser(id, role, transaction);
      return tokens;
    });
    return transactionResult;
  }

  private async loginUser(id: number, role: string, transaction?: TransactionClient): Promise<JwtType> {
    const payload = { id, role };
    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);
    await this.jwtService.saveJwt(id, refreshToken, transaction);

    return { accessToken, refreshToken };
  }

  private async createLocalUser(createUserDto: CreateUserDto, transaction?: TransactionClient): Promise<UserEntity> {
    const selectFields = ['role'];
    const provider = 'local';
    const hashPassword = await hash(createUserDto.password, 10);
    const user = { ...createUserDto, password: hashPassword };
    const registratedUser = await this.userService.create(user, provider, selectFields, transaction);
    return registratedUser;
  }

  private async createYandexUser(yandexUser: YandexUser, transaction?: TransactionClient): Promise<UserEntity> {
    const { username, email } = yandexUser;
    const selectFields = ['role'];
    const provider = 'yandex';
    const user: CreateUserDto = {
      username,
      email,
      password: null,
    };

    const registratedUser = await this.userService.create(user, provider, selectFields, transaction);
    return registratedUser;
  }
}
