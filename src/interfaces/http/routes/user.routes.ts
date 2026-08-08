import { Router } from "express";
import { UserController } from "../controllers/entities/UserController";
import { validateRequest } from "../validators/validateRequest";
import { registerUserSchema } from "../schemas/registerUserSchema";

export const createUserRouter = (
  userController: UserController,
): Router => {
  const router = Router();

  router.post(
    "/register",
    validateRequest(registerUserSchema),
    userController.register,
  );

  return router;
};