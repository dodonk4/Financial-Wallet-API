import { IAccountRepository } from "../../../../application/ports/output/IAccountRepository.ts";
import { Account } from "../../../../domain/entities/Account.ts";
import { Prisma, PrismaClient } from "../../../../../generated/prisma/client.ts";
import { AccountNotFound } from "../../../../domain/errors/404/AccountNotFoundError.ts";
import { Direction } from "../../../../domain/entities/Direction.ts";


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

    const createdAccount = Account.reconstitute(prismaCreatedAccount);

    return createdAccount;
  }

  async findById(id: string): Promise<Account> {
    const account = await this.prisma.account.findUnique({ where: { id } });

    if (!account) {
      throw new AccountNotFound();
    }

    const response = Account.reconstitute(account);

    return response;
  }

  async updateAmountById(id: string, amount: number, direction: Direction): Promise<Account> {

    if (direction === "DEBIT") {
      amount = -amount;
    }

    const account = await this.findById(id);

    const prismaResponse = await this.prisma.account.update({
      where: { id },
      data: {
        balanceCache: account.balanceCache + amount,
      }
    });

    const response = Account.reconstitute(prismaResponse);

    return response;
  }
}