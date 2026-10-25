import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ValidationError, type ValidationIssue } from '../errors/ValidationError.ts';

export type RequestSource = 'body' | 'query' | 'params';

// Di Express 5 req.query itu read-only, jadi hasil validasi disimpan di res.locals
export function validate(schema: ZodSchema, source: RequestSource): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const hasil = schema.safeParse(req[source] ?? {});

    if (!hasil.success) {
      const issues: ValidationIssue[] = hasil.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));
      return next(new ValidationError(issues));
    }

    const validated = (res.locals.validated ?? {}) as Record<string, unknown>;
    validated[source] = hasil.data;
    res.locals.validated = validated;
    return next();
  };
}

export function getValidated<T>(res: Response, source: RequestSource): T {
  const validated = (res.locals.validated ?? {}) as Record<string, unknown>;
  return validated[source] as T;
}