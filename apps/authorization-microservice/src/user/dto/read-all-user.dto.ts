import { BaseReadAllDto } from '@app/common';

export class ReadAllUserDto extends BaseReadAllDto {
  login?: string;
  email?: string;
}
