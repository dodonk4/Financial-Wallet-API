import { Request, Response, NextFunction } from "express";
import type { ParamsDictionary } from 'express-serve-static-core';
import { CheckAccountBalanceDTORequest } from "../../use-cases/accounts/checkAccountBalance/CheckAccountBalanceDTORequest";
type RequestVariation = ParamsDictionary |
CheckAccountBalanceDTORequest;

export interface IAuthMiddleware {
    verifyAuth(req: Request<RequestVariation>, res: Response, next: NextFunction): Promise<void>
}