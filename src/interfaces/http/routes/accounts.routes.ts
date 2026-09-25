import { Router } from "express"
import { AccountsController } from "../controllers/entities/AccountsController"
import { IAuthMiddleware } from "../../../application/ports/input/IAuthMiddleware";
import { CheckAccountBalanceDTORequest } from "../../../application/use-cases/accounts/checkAccountBalance/CheckAccountBalanceDTORequest";

export const createAccountsRouter = (
    accountsController: AccountsController,
    authMiddleware: IAuthMiddleware,
): Router => {

    const router = Router();

    router.get<CheckAccountBalanceDTORequest>(
        "/:accountId/balance",
        authMiddleware.verifyAuth,
        accountsController.checkAccountBalance,
    )

    return router;

}