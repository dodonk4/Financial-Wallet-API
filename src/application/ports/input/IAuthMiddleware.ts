import { Request, Response, NextFunction } from "express";
export interface IAuthMiddleware {
    verifyAuth(req: Request, res: Response, next: NextFunction): Promise<void>
}