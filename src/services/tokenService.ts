import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';

export interface TokenPayload {
  userId: number;
  role: 'admin' | 'owner' | 'customer';
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET belum diisi di .env');
  return secret;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '2h') as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, getSecret()) as jwt.JwtPayload;
    return { userId: Number(decoded.userId), role: decoded.role };
  } catch {
    throw new UnauthorizedError('Token tidak valid atau sudah kedaluwarsa');
  }
}