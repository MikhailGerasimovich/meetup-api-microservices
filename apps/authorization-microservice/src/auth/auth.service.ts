import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/types/user.entity';
import { compareSync, hash } from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtType } from './types/jwt.type';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '../jwt/jwt.service';

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

  public async login(user: User): Promise<JwtType> {
    const payload = { id: user.id, roles: user.roles };

    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);

    await this.jwtService.saveJwt(String(user.id), refreshToken);

    return { accessToken, refreshToken };
  }

  public async refresh(userPayload: JwtPayloadDto, refreshToken: string): Promise<JwtType> {
    const userId = String(userPayload.id);

    const token = await this.jwtService.readJwt(userId, refreshToken);

    if (!token) {
      await this.jwtService.deleteAllUserJwt(userId);
      throw new RpcException({ message: 'Need to login', statusCode: HttpStatus.UNAUTHORIZED });
    }

    const isValidToken = await this.jwtService.isValidRefreshJwt(token);
    if (!isValidToken) {
      await this.jwtService.deleteJwt(userId, refreshToken);
      throw new RpcException({ message: 'Need to login', statusCode: HttpStatus.UNAUTHORIZED });
    }

    await this.jwtService.deleteJwt(userId, refreshToken);

    const payload = { id: userPayload.id, roles: userPayload.roles };
    const newAccessToken = await this.jwtService.generateAccessJwt(payload);
    const newRefreshToken = await this.jwtService.generateRefreshJwt(payload);

    await this.jwtService.saveJwt(userId, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
