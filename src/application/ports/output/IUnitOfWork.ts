import { IAccountRepository } from "./IAccountRepository";
import { IRefreshTokenRepository } from "./IRefreshTokenRepository";
import { IUserRepository } from "./IUserRepository";

export interface TransactionRepositories {
  user: IUserRepository;
  account: IAccountRepository;
  refreshToken: IRefreshTokenRepository;
}

export interface IUnitOfWork {
  execute<T>(
    callback: (repositories: TransactionRepositories) => Promise<T>
  ): Promise<T>;
}