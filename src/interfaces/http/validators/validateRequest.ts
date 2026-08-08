import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodError } from "zod";

export const validateRequest =
  (schema: ZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }

      next(error);
    }
  };