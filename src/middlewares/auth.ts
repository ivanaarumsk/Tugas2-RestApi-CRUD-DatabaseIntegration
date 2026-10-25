import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';
import { verifyToken } from '../services/tokenService.ts';

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token tidak ditemukan'));
  }
  try {
    res.locals.user = verifyToken(header.slice(7));
    return next();
  } catch (error) {
    return next(error);
  }
}