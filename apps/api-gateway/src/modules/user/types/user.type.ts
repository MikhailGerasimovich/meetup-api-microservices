import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class UserType {
  @ApiProperty({ description: 'User identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'User username', example: 'user' })
  username: string;

  @ApiProperty({ description: 'User email', example: 'user@mail.ru' })
  email: string;

  constructor(user: UserEntity) {
    this.id = user?.id;
    this.username = user?.username;
    this.email = user?.email;
  }
}
