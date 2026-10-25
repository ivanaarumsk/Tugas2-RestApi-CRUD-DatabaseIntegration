import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ForbiddenError } from '../errors/ForbiddenError.ts';

export function authorize(...roles: Array<'admin' | 'owner' | 'customer'>): RequestHandler {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!user || !roles.includes(user.role)) {
      return next(new ForbiddenError('Role kamu tidak punya akses ke endpoint ini'));
    }
    return next();
  };
}