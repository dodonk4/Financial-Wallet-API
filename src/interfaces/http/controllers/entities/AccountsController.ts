import { Request, Response } from "express";
import { CheckAccountBalanceUseCase } from "../../../../application/use-cases/accounts/checkAccountBalance/CheckAccountBalanceUseCase";
import { CheckAccountBalanceRequestDTO } from "../../../../application/use-cases/accounts/checkAccountBalance/CheckAccountBalanceRequestDTO";
import { CreateAdditionalAccountRequestDTO } from "../../../../application/use-cases/accounts/createAdditionalAccount/CreateAdditionalAccountRequestDTO";
import { CreateAdditionalAccountUseCase } from "../../../../application/use-cases/accounts/createAdditionalAccount/CreateAdditionalAccountUseCase";

export class AccountsController {
    constructor(
        private readonly checkAccountBalanceUseCase: CheckAccountBalanceUseCase,
        private readonly createAdditionalAccountUseCase: CreateAdditionalAccountUseCase
    ) { }

    checkAccountBalance = async (
        req: Request<CheckAccountBalanceRequestDTO>,
        res: Response,
    ): Promise<void> => {
        if(!req.headers.authorization){
            throw new Error("User not authenticated"); //Create new error
        }
        const result = await this.checkAccountBalanceUseCase.execute(req.params, req.headers.authorization);
        res.status(200).json(result);
    }

    createAdditionalAccount = async (
        req: Request<unknown, unknown, CreateAdditionalAccountRequestDTO>,
        res: Response,
    ): Promise<void> => {
        if(!req.headers.authorization){
            throw new Error("User not authenticated"); //Create new error
        }
        const result = await this.createAdditionalAccountUseCase.execute(req.body, req.headers.authorization);
        res.status(201).send(result);
    }
}