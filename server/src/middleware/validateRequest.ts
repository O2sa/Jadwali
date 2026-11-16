import type { Request, Response, NextFunction } from 'express';
import type { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query as any;
      if (parsed.params !== undefined) req.params = parsed.params as any;
      next();
    } catch (error) {
      next(error);
    }
  };
