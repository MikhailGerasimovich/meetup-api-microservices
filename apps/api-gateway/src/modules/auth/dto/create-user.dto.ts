import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User username', example: 'your_username', required: true, nullable: false })
  username: string;

  @ApiProperty({ description: 'User mail', example: 'your_mail@mail.ru', required: true, nullable: false })
  email: string;

  @ApiProperty({ description: 'User password', example: 'your_password', required: true, nullable: false })
  password: string;
}
