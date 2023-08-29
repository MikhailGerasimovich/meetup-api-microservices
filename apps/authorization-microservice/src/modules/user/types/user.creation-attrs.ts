import { ROLES } from '@app/common';

export class UserCreationAttrs {
  login: string;
  email: string;
  password: string;
  role: ROLES;
}
