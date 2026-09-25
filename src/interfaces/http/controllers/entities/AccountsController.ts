import { Request, Response } from "express";
import { CheckAccountBalanceUseCase } from "../../../../application/use-cases/accounts/checkAccountBalance/CheckAccountBalanceUseCase";
import { CheckAccountBalanceDTORequest } from "../../../../application/use-cases/accounts/checkAccountBalance/CheckAccountBalanceDTORequest";

export class AccountsController {
    constructor(
        private readonly checkAccountBalanceUseCase: CheckAccountBalanceUseCase
    ) { }

    checkAccountBalance = async (
        req: Request<CheckAccountBalanceDTORequest>,
        res: Response,
    ): Promise<void> => {
        const result = await this.checkAccountBalanceUseCase.execute(req.params, req.headers.authorization || "");
        res.status(200).json(result);
    }
}