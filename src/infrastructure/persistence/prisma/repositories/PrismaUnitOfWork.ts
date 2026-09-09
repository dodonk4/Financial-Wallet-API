import { PrismaClient } from "../../../../../generated/prisma/client.ts";

import { IUnitOfWork } from "../../../../application/ports/output/IUnitOfWork.ts";
import {
  TransactionRepositories,
} from "../../../../application/ports/output/IUnitOfWork.ts";

import { PrismaUserRepository } from "./PrismaUserRepository.ts";
import { PrismaAccountRepository } from "./PrismaAccountRepository.ts";
import { PrismaRefreshTokenRepository } from "./PrismaRefreshTokenRepository.ts";
import { PrismaTransactionRepository } from "./PrismaTransactionRepository.ts";
import { PrismaLedgerEntryRepository } from "./PrismaLedgerEntryRepository.ts";


export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  async execute<T>(
    callback: (repositories: TransactionRepositories) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      const repositories: TransactionRepositories = {
        user: new PrismaUserRepository(tx),
        account: new PrismaAccountRepository(tx),
        refreshToken: new PrismaRefreshTokenRepository(tx),
        transaction: new PrismaTransactionRepository(tx),
        ledgerEntry: new PrismaLedgerEntryRepository(tx),
      };

      return callback(repositories);
    });
  }
}
