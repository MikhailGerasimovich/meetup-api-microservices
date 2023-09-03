import { ROLES } from '@app/common';

export class UserEntity {
  id: number;
  login: string;
  email?: string;
  password?: string;
  avatarFilename?: string;
  role?: ROLES;
}
