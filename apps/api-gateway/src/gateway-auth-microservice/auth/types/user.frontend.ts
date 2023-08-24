import { User } from './user.entity';

export class UserFrontend {
  id: number | string;
  login: string;
  email: string;

  constructor(user: User) {
    this.id = user?.id;
    this.login = user?.login;
    this.email = user?.email;
  }
}
