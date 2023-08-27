import { Response } from 'express';

export function setupAuthCookie(res: Response, cookie: any): void {
  res.cookie('auth-cookie', cookie, { httpOnly: true });
}
