import { Router } from "express"
import { AccountsController } from "../controllers/entities/AccountsController"
import { IAuthMiddleware } from "../../../application/ports/input/IAuthMiddleware";
import { CheckAccountBalanceRequestDTO } from "../../../application/use-cases/accounts/checkAccountBalance/CheckAccountBalanceRequestDTO";
import { validateRequest } from "../validators/validateRequest";
import { createAdditionalAccountSchema } from "../schemas/createAdditionalAccountSchema";

export const createAccountsRouter = (
    accountsController: AccountsController,
    authMiddleware: IAuthMiddleware,
): Router => {

    const router = Router();

    router.get<CheckAccountBalanceRequestDTO>(
        "/:accountId/balance",
        authMiddleware.verifyAuth,
        accountsController.checkAccountBalance,
    )

    router.post(
        "/create",
        validateRequest(createAdditionalAccountSchema),
        authMiddleware.verifyAuth,
        accountsController.createAdditionalAccount,
    )

    return router;

}