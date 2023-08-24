export class JwtFrontend {
  public accessToken: string;
  public refreshToken: string;

  constructor(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
  }
}
