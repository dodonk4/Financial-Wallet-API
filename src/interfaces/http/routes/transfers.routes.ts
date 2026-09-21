import { Router } from "express";
import { TransfersController } from "../controllers/entities/TransfersController";
import { validateRequest } from "../validators/validateRequest";
import { transferSchema } from "../schemas/transferSchema";
import { IAuthMiddleware } from "../../../application/ports/input/IAuthMiddleware";

export const createTranfersRouter = (
    transfersController: TransfersController,
    authMiddleware: IAuthMiddleware,
): Router => {
    const router = Router();

    router.post(
        "/",
        validateRequest(transferSchema),
        authMiddleware.verifyAuth,
        transfersController.transfer,
    )

    return router;
}