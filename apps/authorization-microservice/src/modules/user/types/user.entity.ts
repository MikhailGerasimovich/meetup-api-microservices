import { ROLES } from '@app/common';

export class UserEntity {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  provider?: string;
  avatarFilename?: string;
  role?: ROLES;
}
