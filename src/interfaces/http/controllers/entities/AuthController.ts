import { Request, Response, NextFunction } from "express";

import { RegisterUserRequestDTO } from "../../../../application/use-cases/auth/register/RegisterUserRequestDTO.ts";
import { RegisterUserUseCase } from "../../../../application/use-cases/auth/register/RegisterUserUseCase.ts";
import { LoginRequestDTO } from "../../../../application/use-cases/auth/login/LoginRequestDTO.ts";
import { LoginUseCase } from "../../../../application/use-cases/auth/login/LoginUseCase.ts";
import { RefreshTokenUseCase } from "../../../../application/use-cases/auth/refresh/RefreshTokenUseCase.ts";
import { InvalidCredentialsError } from "../../../../domain/errors/InvalidCredentialsError.ts";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) { }

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
  ): Promise<void> => {
    const result = await this.loginUseCase.execute(req.body);
    res.status(201).json(result);
  }

  refresh = async (
    req: Request<unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {

    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new InvalidCredentialsError();
    }

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
        throw new InvalidCredentialsError();
    }

    const result = await this.refreshTokenUseCase.execute({ authorization: token });
    res.status(201).json(result);
  }
}