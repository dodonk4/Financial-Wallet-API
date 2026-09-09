import { Router } from "express";
import { TransfersController } from "../controllers/entities/TransfersController";
import { validateRequest } from "../validators/validateRequest";
import { transferSchema } from "../schemas/transferSchema";

export const createTranfersRouter = (
    transfersController: TransfersController
): Router => {
    const router = Router();

    router.post(
        "/",
        validateRequest(transferSchema),
        transfersController.transfer,
    )

    return router;
}