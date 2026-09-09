import { IAccountRepository } from "./IAccountRepository";
import { ILedgerEntryRepository } from "./ILedgerEntryRepository";
import { IRefreshTokenRepository } from "./IRefreshTokenRepository";
import { ITransactionRepository } from "./ITransactionRepository";
import { IUserRepository } from "./IUserRepository";

export interface TransactionRepositories {
  user: IUserRepository;
  account: IAccountRepository;
  refreshToken: IRefreshTokenRepository;
  transaction: ITransactionRepository;
  ledgerEntry: ILedgerEntryRepository;
}

export interface IUnitOfWork {
  execute<T>(
    callback: (repositories: TransactionRepositories) => Promise<T>
  ): Promise<T>;
}