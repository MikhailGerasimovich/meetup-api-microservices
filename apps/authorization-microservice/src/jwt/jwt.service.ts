import { Injectable } from '@nestjs/common';
import { JwtRepository } from './jwt.repository';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JWT } from '../constants/constants';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtRepository: JwtRepository,
    private readonly nestJwtService: NestJwtService,
  ) {}

  public async generateAccessJwt(payload: JwtPayloadDto): Promise<string> {
    const accessToken = await this.nestJwtService.signAsync(payload, {
      secret: JWT.ACCESS_SECRET,
      expiresIn: JWT.ACCESS_DURATION,
    });

    return accessToken;
  }

  public async generateRefreshJwt(payload: JwtPayloadDto): Promise<string> {
    const refreshToken = await this.nestJwtService.signAsync(payload, {
      secret: JWT.REFRESH_SECRET,
      expiresIn: JWT.REFRESH_DURATION,
    });

    return refreshToken;
  }

  public async isValidRefreshJwt(jwt: string): Promise<boolean> {
    try {
      await this.nestJwtService.verifyAsync(jwt, {
        secret: JWT.REFRESH_SECRET,
        maxAge: JWT.REFRESH_DURATION,
      });
    } catch {
      return false;
    }
    return true;
  }

  public async readJwt(userId: number, refreshToken: string): Promise<string | undefined> {
    const jwt = await this.jwtRepository.readJwt(userId, refreshToken);
    return jwt;
  }

  public async saveJwt(userId: number, refreshToken: string): Promise<void> {
    await this.jwtRepository.saveJwt(userId, refreshToken);
  }

  public async deleteJwt(userId: number, refreshToken: string): Promise<void> {
    await this.jwtRepository.deleteJwt(userId, refreshToken);
  }

  public async deleteAllUserJwt(userId: number): Promise<void> {
    await this.jwtRepository.deleteAllUserJwt(userId);
  }
}
