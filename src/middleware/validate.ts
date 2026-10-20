import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';

interface Schemas {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
}

interface FieldError {
  field: string;
  message: string;
}

const toFieldErrors = (issues: z.core.$ZodIssue[]): FieldError[] =>
  issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.map(String).join('.') : 'body',
    message: issue.message,
  }));

export const validate = (schemas: Schemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: FieldError[] = [];
    let parsedBody: unknown;
    let parsedQuery: unknown;

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) errors.push(...toFieldErrors(result.error.issues));
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (result.success) parsedQuery = result.data;
      else errors.push(...toFieldErrors(result.error.issues));
    }

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body ?? {});
      if (result.success) parsedBody = result.data;
      else errors.push(...toFieldErrors(result.error.issues));
    }

    if (errors.length > 0) {
      res.status(400).json({ status: 'fail', message: 'Validasi gagal', errors });
      return;
    }

    if (parsedBody !== undefined) req.body = parsedBody;
    if (parsedQuery !== undefined) {
      Object.defineProperty(req, 'query', {
        value: parsedQuery,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    next();
  };
};