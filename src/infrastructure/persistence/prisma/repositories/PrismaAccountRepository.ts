import { IAccountRepository } from "../../../../application/ports/output/IAccountRepository.ts";
import { Account } from "../../../../domain/entities/Account.ts";
import { Prisma, PrismaClient } from "../../../../../generated/prisma/client.ts";
import { AccountNotFound } from "../../../../domain/errors/AccountNotFoundError.ts";


export class PrismaAccountRepository implements IAccountRepository {

  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) { }

  async create(account: Account): Promise<Account> {
    const prismaCreatedAccount = await this.prisma.account.create({
      data: {
        id: account.id,
        userId: account.userId,
        currency: account.currency,
      },
    });

    const createdAccount = Account.create({
      id: prismaCreatedAccount.id,
      userId: prismaCreatedAccount.userId,
      currency: prismaCreatedAccount.currency
    })

    return createdAccount;
  }

  async findById(id: string): Promise<Account> {
    const account = await this.prisma.account.findUnique({ where: { id } });

    if (!account) {
      throw new AccountNotFound();
    }

    const response = Account.reconstitute({
      id: account.id,
      userId: account.userId,
      currency: account.currency,
      balanceCache: Number(account.balanceCache),
      heldBalance: Number(account.heldBalance),
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });

    return response;
  }
}