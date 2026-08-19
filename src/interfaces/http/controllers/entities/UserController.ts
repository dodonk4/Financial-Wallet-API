import { Request, Response, NextFunction } from "express";

import { RegisterUserRequestDTO } from "../../../../application/use-cases/auth/register/RegisterUserRequestDTO.ts";
import { RegisterUserUseCase } from "../../../../application/use-cases/auth/register/RegisterUserUseCase.ts";
import { LoginRequestDTO } from "../../../../application/use-cases/auth/login/LoginRequestDTO.ts";
import { LoginUseCase } from "../../../../application/use-cases/auth/login/LoginUseCase.ts";

export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  register = async (
    req: Request<unknown, unknown, RegisterUserRequestDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
      const result = await this.registerUserUseCase.execute(req.body);
      res.status(201).json(result);
  };

  login = async (
    req: Request<unknown, unknown, LoginRequestDTO>,
    res: Response,
    next: NextFunction,
  ): Promise <void> => {
    const result = await this.loginUseCase.execute(req.body);
    res.status(201).json(result);
  }
}