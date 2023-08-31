import { Response } from 'express';

export function setAuthCookie(res: Response, cookie: any): void {
  res.cookie('auth-cookie', cookie, { httpOnly: true, sameSite: true });
}
