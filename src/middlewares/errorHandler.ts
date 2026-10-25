import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError.ts';

// Drizzle kadang membungkus error driver, jadi kode error SQL Server dicari lewat "cause"
function getSqlErrorNumber(error: unknown): number | undefined {
  let current: unknown = error;
  for (let i = 0; i < 5; i += 1) {
    if (typeof current !== 'object' || current === null) return undefined;
    const code = (current as { number?: unknown }).number;
    if (typeof code === 'number') return code;
    current = (current as { cause?: unknown }).cause;
  }
  return undefined;
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  // 1) JSON di body rusak
  const bodyError = error as SyntaxError & { status?: number; type?: string };
  if (error instanceof SyntaxError && bodyError.type === 'entity.parse.failed') {
    res.status(400).json({ status: 'fail', message: 'JSON pada body tidak valid' });
    return;
  }

  // 2) Error yang kita lempar sendiri (validasi, not found, 401, 403, dst)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'fail',
      message: error.message,
      ...(error.details !== undefined ? { errors: error.details } : {}),
    });
    return;
  }

  // 3) Bentrok constraint database: 2627 = unique, 547 = foreign key
  const sqlNumber = getSqlErrorNumber(error);
  if (sqlNumber === 2627 || sqlNumber === 547) {
    res.status(409).json({
      status: 'fail',
      message: 'Data bentrok dengan data yang sudah ada',
    });
    return;
  }

  // 4) Error tak terduga: detail cukup di terminal, jangan dikirim ke client
  console.error('Unhandled error:', error);
  res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
};