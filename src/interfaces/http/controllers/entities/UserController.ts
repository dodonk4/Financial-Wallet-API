import { Request, Response, NextFunction } from "express";

import { RegisterUserRequestDTO } from "../../../../application/use-cases/auth/RegisterUserRequestDTO";
import { RegisterUserUseCase } from "../../../../application/use-cases/auth/RegisterUserUseCase";

export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  register = async (
    req: Request<unknown, unknown, RegisterUserRequestDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.registerUserUseCase.execute(req.body);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}