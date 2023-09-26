import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from '@app/common';
import { JwtRepository } from './jwt.repository';
import { ConfigService } from '@nestjs/config';
import { TransactionClient } from '../../common';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtRepository: JwtRepository,
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  public async generateAccessJwt(payload: JwtPayloadDto): Promise<string> {
    const accessToken = await this.nestJwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_DURATION'),
    });

    return accessToken;
  }

  public async generateRefreshJwt(payload: JwtPayloadDto): Promise<string> {
    const refreshToken = await this.nestJwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_DURATION'),
    });

    return refreshToken;
  }

  public async isValidRefreshJwt(jwt: string): Promise<boolean> {
    try {
      await this.nestJwtService.verifyAsync(jwt, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        maxAge: this.configService.get('JWT_REFRESH_DURATION'),
      });
    } catch {
      return false;
    }
    return true;
  }

  public async readJwt(userId: number, refreshToken: string, transaction?: TransactionClient): Promise<string | undefined> {
    const jwt = await this.jwtRepository.readJwt(userId, refreshToken, transaction);
    return jwt;
  }

  public async saveJwt(userId: number, refreshToken: string, transaction?: TransactionClient): Promise<void> {
    await this.jwtRepository.saveJwt(userId, refreshToken, transaction);
  }

  public async deleteJwt(userId: number, refreshToken: string, transaction?: TransactionClient): Promise<void> {
    await this.jwtRepository.deleteJwt(userId, refreshToken, transaction);
  }

  public async deleteAllUserJwt(userId: number, transaction?: TransactionClient): Promise<void> {
    await this.jwtRepository.deleteAllUserJwt(userId, transaction);
  }
}
