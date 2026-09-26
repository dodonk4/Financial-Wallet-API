import { Request, Response, NextFunction } from "express";
import type { ParamsDictionary } from 'express-serve-static-core';
import { CheckAccountBalanceRequestDTO } from "../../use-cases/accounts/checkAccountBalance/CheckAccountBalanceRequestDTO";
type RequestVariation = ParamsDictionary |
CheckAccountBalanceRequestDTO;

export interface IAuthMiddleware {
    verifyAuth(req: Request<RequestVariation>, res: Response, next: NextFunction): Promise<void>
}