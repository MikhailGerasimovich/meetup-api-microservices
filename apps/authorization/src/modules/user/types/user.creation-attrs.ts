import { ROLES } from '@app/common';

export class UserCreationAttrs {
  username: string;
  email: string;
  password?: string;
  provider: string;
  role: ROLES;
}
