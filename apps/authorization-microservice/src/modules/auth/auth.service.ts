import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { compareSync, hash } from 'bcryptjs';
import { JwtPayloadDto, JwtType } from '@app/common';
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

  public async validateUser(login: string, password: string): Promise<JwtPayloadDto> {
    const candidate = await this.userService.readByLogin(login, ['password', 'role']);

    if (candidate && compareSync(password, candidate.password)) {
      return { id: candidate.id, role: candidate.role };
    }

    throw new RpcException({ message: 'wrong login or password', statusCode: HttpStatus.BAD_REQUEST });
  }

  public async registration(createUserDto: CreateUserDto): Promise<JwtType> {
    const hashPassword = await hash(createUserDto.password, 10);
    const registratedUser = await this.userService.create({
      ...createUserDto,
      password: hashPassword,
    });

    const payload = { id: registratedUser.id, role: registratedUser.role };

    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);

    return { accessToken, refreshToken };
  }

  public async login(user: UserEntity): Promise<JwtType> {
    const payload = { id: user.id, role: user.role };

    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);

    await this.jwtService.saveJwt(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  public async logout(userPayload: JwtPayloadDto, refreshToken: string): Promise<void> {
    await this.jwtService.deleteJwt(userPayload.id, refreshToken);
  }

  public async refresh(userPayload: JwtPayloadDto, refreshToken: string): Promise<JwtType> {
    const token = await this.jwtService.readJwt(userPayload.id, refreshToken);

    if (!token) {
      await this.jwtService.deleteAllUserJwt(userPayload.id);
      throw new RpcException({ message: 'Need to login', statusCode: HttpStatus.UNAUTHORIZED });
    }

    const isValidToken = await this.jwtService.isValidRefreshJwt(token);
    if (!isValidToken) {
      await this.jwtService.deleteJwt(userPayload.id, refreshToken);
      throw new RpcException({ message: 'Need to login', statusCode: HttpStatus.UNAUTHORIZED });
    }

    await this.jwtService.deleteJwt(userPayload.id, refreshToken);

    const payload = { id: userPayload.id, role: userPayload.role };
    const newAccessToken = await this.jwtService.generateAccessJwt(payload);
    const newRefreshToken = await this.jwtService.generateRefreshJwt(payload);

    await this.jwtService.saveJwt(userPayload.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
