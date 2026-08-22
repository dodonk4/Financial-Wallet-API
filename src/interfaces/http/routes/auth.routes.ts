import { Router } from "express";
import { AuthController } from "../controllers/entities/AuthController";
import { validateRequest } from "../validators/validateRequest";
import { registerUserSchema } from "../schemas/registerUserSchema";
import { loginSchema } from "../schemas/loginSchema";

export const createAuthRouter = (
  authController: AuthController,
): Router => {
  const router = Router();

  router.post(
    "/register",
    validateRequest(registerUserSchema),
    authController.register,
  );

  router.post(
    "/login",
    validateRequest(loginSchema),
    authController.login,
  )

  router.post(
    "/refresh",
    authController.refresh,
  )

  return router;
};