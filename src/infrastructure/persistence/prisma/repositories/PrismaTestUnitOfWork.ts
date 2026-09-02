import { PrismaClient } from "../../../../../generated/prisma/client.ts";

import { IUnitOfWork } from "../../../../application/ports/output/IUnitOfWork.ts";
import {
  TransactionRepositories,
} from "../../../../application/ports/output/IUnitOfWork.ts";
import { PrismaUserRepository } from "./PrismaUserRepository.ts";
import { PrismaAccountRepository } from "./PrismaAccountRepository.ts";
import { PrismaRefreshTokenRepository } from "./PrismaRefreshTokenRepository.ts";
import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';

let prismaTestingHelper: PrismaTestingHelper<PrismaClient> | undefined;
let prismaService: PrismaClient;

export class PrismaTestUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  async execute<T>(
    callback: (repositories: TransactionRepositories) => Promise<T>,
  ): Promise<T> {

    prismaTestingHelper = new PrismaTestingHelper(this.prisma);

    prismaService = prismaTestingHelper.getProxyClient();

    //There's an issue with this line. Is not supposed to do a rollback if I
    //don't call "prismaTestingHelper?.rollbackCurrentTransaction()" after each test.
    //BUT IT DOES. It works just fine without it.
    //I still have to find why
    await prismaTestingHelper.startNewTransaction();

    return prismaService.$transaction(async (tx) => {
      const repositories: TransactionRepositories = {
        user: new PrismaUserRepository(tx),
        account: new PrismaAccountRepository(tx),
        refreshToken: new PrismaRefreshTokenRepository(tx),
      };

      const callbackReturn = callback(repositories);

      return callbackReturn;
    });
  }
}

export { prismaTestingHelper }
