export class UserEntity {
  id: number;
  login: string;
  email?: string;
  password?: string;
  roles?: string[];
}
