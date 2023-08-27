import { UserEntity } from './user.entity';

export class UserType {
  id: number;
  login: string;
  email: string;

  constructor(user: UserEntity) {
    this.id = user?.id;
    this.login = user?.login;
    this.email = user?.email;
  }
}
