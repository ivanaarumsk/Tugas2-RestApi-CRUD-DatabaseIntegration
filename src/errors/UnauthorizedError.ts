import { AppError } from './AppError.ts';

export class UnauthorizedError extends AppError {
  constructor(message = 'Belum login atau token tidak valid') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}