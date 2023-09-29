import { ApiProperty } from '@nestjs/swagger';

export class JwtPayloadDto {
  @ApiProperty({ description: 'User id from jwt payload', example: 1 })
  id: number;

  @ApiProperty({ description: 'User role from jwt payload', example: 'USER' })
  role: string;
}
