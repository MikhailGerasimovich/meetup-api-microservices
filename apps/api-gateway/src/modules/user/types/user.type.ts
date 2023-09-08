import { UserEntity } from './user.entity';

export class UserType {
  id: number;
  username: string;
  email: string;

  constructor(user: UserEntity) {
    this.id = user?.id;
    this.username = user?.username;
    this.email = user?.email;
  }
}
