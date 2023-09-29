import { BaseReadAllDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';

export class ReadAllUserDto extends BaseReadAllDto {
  @ApiProperty({ description: 'User username', example: 'user', required: false })
  username?: string;

  @ApiProperty({ description: 'User email', example: 'user@mail.ru', required: false })
  email?: string;
}
