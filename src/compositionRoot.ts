import app from "./appConsistent.ts";
import { Response, Request } from "express";
import { PrismaUserRepository } from "./interfaces/persistence/prisma/repositories/PrismaUserRepository.ts";
import { PrismaUnitOfWork } from "./interfaces/persistence/prisma/repositories/PrismaUnitOfWork.ts";
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
import { LogoutUseCase } from "./application/use-cases/auth/logout/LogoutUseCase.ts";
import { LogoutAllUseCase } from "./application/use-cases/auth/logout/LogoutAllUseCase.ts";
import errorHandler from "./interfaces/http/middlewares/errorHandler.ts";
import { TransferUsecase } from "./application/use-cases/transfers/transfer/TransferUseCase.ts";
import { RedisIdempotencyStore } from "./interfaces/persistence/redis/RedisIdempotencyStore.ts";
import { redisClient } from "./infrastructure/cache/redisClient.ts";
import { TransfersController } from "./interfaces/http/controllers/entities/TransfersController.ts";
import { createTranfersRouter } from "./interfaces/http/routes/transfers.routes.ts";
import { PrismaTransactionRepository } from "./interfaces/persistence/prisma/repositories/PrismaTransactionRepository.ts";
import { createServer } from "node:http";
import { SocketIoNotificationPublisher } from "./interfaces/persistence/socket-io/Socket-ioNotificationPublisher.ts";
import { AuthMiddleware } from "./interfaces/http/middlewares/authMiddleware.ts";
import { CheckAccountBalanceUseCase } from "./application/use-cases/accounts/checkAccountBalance/CheckAccountBalanceUseCase.ts";
import { PrismaAccountRepository } from "./interfaces/persistence/prisma/repositories/PrismaAccountRepository.ts";
import { createAccountsRouter } from "./interfaces/http/routes/accounts.routes.ts";
import { AccountsController } from "./interfaces/http/controllers/entities/AccountsController.ts";

const httpServer = createServer(app);

const notificationPublisher = new SocketIoNotificationPublisher(httpServer);

const userRepository = new PrismaUserRepository(prisma);

const accountRepository = new PrismaAccountRepository(prisma);

const passwordHasher = new Argon2PasswordHasher();

const tokenProvider = new JwtTokenProvider();

const tokenHasher = new SHA256Hasher();

const eventPublisher = new NodeEventPublisher();

const unitOfWork = new PrismaUnitOfWork(prisma);

const idempotencyStore = new RedisIdempotencyStore(redisClient, tokenHasher);

const transactionRepository = new PrismaTransactionRepository(prisma);

const authMiddleware = new AuthMiddleware(tokenProvider);

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
  unitOfWork,
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

const transferUseCase = new TransferUsecase(
  idempotencyStore,
  tokenHasher,
  unitOfWork,
  transactionRepository,
  notificationPublisher,
  tokenProvider
)

const checkAccountBalanceUseCase = new CheckAccountBalanceUseCase(
  accountRepository,
  tokenProvider
)

const authController = new AuthController(
  registerUserUseCase,
  loginUseCase,
  refreshTokenUseCase,
  logoutUseCase,
  logoutAllUseCase
);

const transfersController = new TransfersController(
  transferUseCase,
)

const accountsController = new AccountsController(
  checkAccountBalanceUseCase,
)

const authRouter = createAuthRouter(
  authController,
);

const transfersRouter = createTranfersRouter(
  transfersController,
  authMiddleware
);

const accountsRouter = createAccountsRouter(
  accountsController,
  authMiddleware
)

app.use("/auth", authRouter);
app.use("/transfers", transfersRouter);
app.use("/accounts", accountsRouter);
app.use("/health", healthRouter);
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Financial Wallet API' });
});

app.use(errorHandler);

export {
  app,
  httpServer,
  prisma,
  userRepository,
  passwordHasher,
  tokenProvider,
  eventPublisher,
  unitOfWork,
  registerUserUseCase,
  authController,
  authRouter,
  accountsController,
  accountsRouter
};