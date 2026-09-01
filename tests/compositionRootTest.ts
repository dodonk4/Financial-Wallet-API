
import app from "../src/appNonConsistent.ts";
import { Response, Request } from "express";

import { PrismaUserRepository } from "./../src/infrastructure/persistence/prisma/repositories/PrismaUserRepository.ts";

import { Argon2PasswordHasher } from "./../src/infrastructure/security/Argon2PasswordHasher.ts";
import { JwtTokenProvider } from "./../src/infrastructure/security/JwtTokenProvider.ts";

import { NodeEventPublisher } from "./../src/infrastructure/events/NodeEventPublisher.ts";

import { RegisterUserUseCase } from "./../src/application/use-cases/auth/register/RegisterUserUseCase.ts";

import { AuthController } from "./../src/interfaces/http/controllers/entities/AuthController.ts";
import { createAuthRouter } from "./../src/interfaces/http/routes/auth.routes.ts";
import { prisma } from "./../src/infrastructure/database/prisma.ts";
import healthRouter from "./../src/interfaces/http/routes/health.routes.ts";
import { LoginUseCase } from "./../src/application/use-cases/auth/login/LoginUseCase.ts";
import { SHA256Hasher } from "./../src/infrastructure/security/SHA256Hasher.ts";
import { RefreshTokenUseCase } from "./../src/application/use-cases/auth/refresh/RefreshTokenUseCase.ts";
import { LogoutUseCase } from "./../src/application/use-cases/auth/logout/LogoutUseCase.ts";
import { LogoutAllUseCase } from "./../src/application/use-cases/auth/logout/LogoutAllUseCase.ts";
import { PrismaTestUnitOfWork } from "../src/infrastructure/persistence/prisma/repositories/PrismaTestUnitOfWork.ts";
import errorHandler from "../src/interfaces/http/middlewares/errorHandler.ts";


const userRepository = new PrismaUserRepository(prisma);

const passwordHasher = new Argon2PasswordHasher();

const tokenProvider = new JwtTokenProvider();

const tokenHasher = new SHA256Hasher();

const eventPublisher = new NodeEventPublisher();

const unitOfWork = new PrismaTestUnitOfWork(prisma);

const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  passwordHasher,
  tokenProvider,
  eventPublisher,
  tokenHasher,
  unitOfWork,
);

const loginUseCase = new LoginUseCase(
  userRepository,
  eventPublisher,
  tokenProvider,
  passwordHasher,
  tokenHasher,
  unitOfWork
)

const refreshTokenUseCase = new RefreshTokenUseCase(
  tokenProvider,
  tokenHasher,
  unitOfWork
)

const logoutUseCase = new LogoutUseCase(
  unitOfWork,
  tokenHasher,
)

const logoutAllUseCase = new LogoutAllUseCase(
  unitOfWork,
  tokenHasher,
)

const authController = new AuthController(
  registerUserUseCase,
  loginUseCase,
  refreshTokenUseCase,
  logoutUseCase,
  logoutAllUseCase
);

const authRouter = createAuthRouter(
  authController,
);

app.use("/auth", authRouter);
app.use("/health", healthRouter);
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Financial Wallet API' });
});

app.use(errorHandler);

export {
  app,
  prisma,
  userRepository,
  passwordHasher,
  tokenProvider,
  eventPublisher,
  unitOfWork,
  registerUserUseCase,
  authController,
  authRouter,
};