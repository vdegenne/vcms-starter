import {Request} from 'express';

export function canAccess(req: Request): boolean {
  return req.session && req.session.user && req.session.user.logged &&
      req.session.user.roles.includes('ADMIN');
}
