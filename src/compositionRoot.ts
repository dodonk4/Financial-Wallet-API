
import app from "./app.ts";
import { Response, Request } from "express";

import { PrismaUserRepository } from "./infrastructure/persistence/prisma/repositories/PrismaUserRepository.ts";
import { PrismaUnitOfWork } from "./infrastructure/persistence/prisma/repositories/PrismaUnitOfWork.ts";

import { Argon2PasswordHasher } from "./infrastructure/security/Argon2PasswordHasher.ts";
import { JwtTokenProvider } from "./infrastructure/security/JwtTokenProvider.ts";

import { NodeEventPublisher } from "./infrastructure/events/NodeEventPublisher.ts";

import { RegisterUserUseCase } from "./application/use-cases/auth/register/RegisterUserUseCase.ts";

import { UserController } from "./interfaces/http/controllers/entities/UserController.ts";
import { createUserRouter } from "./interfaces/http/routes/user.routes.ts";
import { prisma } from "./infrastructure/database/prisma.ts";
import healthRouter from "./interfaces/http/routes/health.routes.ts";


const userRepository = new PrismaUserRepository(prisma);

const passwordHasher = new Argon2PasswordHasher();

const tokenProvider = new JwtTokenProvider();

const eventPublisher = new NodeEventPublisher();

const unitOfWork = new PrismaUnitOfWork(prisma);

const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  passwordHasher,
  tokenProvider,
  eventPublisher,
  unitOfWork,
);

const userController = new UserController(
  registerUserUseCase,
);

const userRouter = createUserRouter(
  userController,
);

app.use("/users", userRouter);
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
  userController,
  userRouter,
};