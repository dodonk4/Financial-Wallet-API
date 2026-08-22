
import app from "./app.ts";
import { Response, Request } from "express";

import { PrismaUserRepository } from "./infrastructure/persistence/prisma/repositories/PrismaUserRepository.ts";
import { PrismaUnitOfWork } from "./infrastructure/persistence/prisma/repositories/PrismaUnitOfWork.ts";

import { Argon2PasswordHasher } from "./infrastructure/security/Argon2PasswordHasher.ts";
import { JwtTokenProvider } from "./infrastructure/security/JwtTokenProvider.ts";

import { NodeEventPublisher } from "./infrastructure/events/NodeEventPublisher.ts";

import { RegisterUserUseCase } from "./application/use-cases/auth/register/RegisterUserUseCase.ts";

import { AuthController } from "./interfaces/http/controllers/entities/AuthController.ts";
import { createAuthRouter } from "./interfaces/http/routes/auth.routes.ts";
import { prisma } from "./infrastructure/database/prisma.ts";
import healthRouter from "./interfaces/http/routes/health.routes.ts";
import { LoginUseCase } from "./application/use-cases/auth/login/LoginUseCase.ts";
import { SHA256Hasher } from "./infrastructure/security/SHA256Hasher.ts";
import { RefreshTokenUseCase } from "./application/use-cases/auth/refresh/RefreshTokenUseCase.ts";


const userRepository = new PrismaUserRepository(prisma);

const passwordHasher = new Argon2PasswordHasher();

const tokenProvider = new JwtTokenProvider();

const tokenHasher = new SHA256Hasher();

const eventPublisher = new NodeEventPublisher();

const unitOfWork = new PrismaUnitOfWork(prisma);

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

const authController = new AuthController(
  registerUserUseCase,
  loginUseCase,
  refreshTokenUseCase
);

const authRouter = createAuthRouter(
  authController,
);

app.use("/auth", authRouter);
app.use("/health", healthRouter);
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Financial Wallet API' });
});

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