import { IAccountRepository } from "../../../../application/ports/output/IAccountRepository.ts";
import { Account } from "../../../../domain/entities/Account.ts";
import { Prisma, PrismaClient } from "../../../../../generated/prisma/client.ts";


export class PrismaAccountRepository implements IAccountRepository {

  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) { }

  async create(account: Account): Promise<Account> {
    const prismaCreatedAccount = await this.prisma.account.create({
      data: {
        id: account.id,
        userId: account.userId,
        balance: account.balance,
        currency: account.currency,
        status: account.status,
      },
    });

    const createdAccount = Account.create({
      id: prismaCreatedAccount.id,
      userId: prismaCreatedAccount.userId,
      currency: prismaCreatedAccount.currency
    })

    return createdAccount;
  }

  // resto de métodos...
}