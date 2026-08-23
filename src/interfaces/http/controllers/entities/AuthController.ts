import { Request, Response, NextFunction } from "express";

import { RegisterUserRequestDTO } from "../../../../application/use-cases/auth/register/RegisterUserRequestDTO.ts";
import { RegisterUserUseCase } from "../../../../application/use-cases/auth/register/RegisterUserUseCase.ts";
import { LoginRequestDTO } from "../../../../application/use-cases/auth/login/LoginRequestDTO.ts";
import { LoginUseCase } from "../../../../application/use-cases/auth/login/LoginUseCase.ts";
import { RefreshTokenUseCase } from "../../../../application/use-cases/auth/refresh/RefreshTokenUseCase.ts";
import { InvalidCredentialsError } from "../../../../domain/errors/InvalidCredentialsError.ts";
import { LogoutUseCase } from "../../../../application/use-cases/auth/logout/LogoutUseCase.ts";
import { LogoutAllUseCase } from "../../../../application/use-cases/auth/logout/LogoutAllUseCase.ts";
import extractToken from "../../auth/extractToken.ts";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutAllUseCase: LogoutAllUseCase,
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

    const token = extractToken(req.headers.authorization);

    const result = await this.refreshTokenUseCase.execute({ authorization: token });
    res.status(201).json(result);
  }

  logout = async (
    req: Request<unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {

    const token = extractToken(req.headers.authorization);

    await this.logoutUseCase.execute({ authorization: token });
    res.status(200);
  }

  logoutAll = async (
    req: Request<unknown, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {

    const token = extractToken(req.headers.authorization);

    await this.logoutAllUseCase.execute({ authorization: token });
    res.status(200);
  }

}