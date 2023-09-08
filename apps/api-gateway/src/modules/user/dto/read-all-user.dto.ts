import { BaseReadAllDto } from '@app/common';

export class ReadAllUserDto extends BaseReadAllDto {
  username?: string;
  email?: string;
}
