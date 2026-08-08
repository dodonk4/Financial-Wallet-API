import { IAccountRepository } from "../../../../application/ports/output/IAccountRepository.ts";
import { Account } from "../../../../domain/entities/Account.ts";
import { Prisma, PrismaClient } from "../../../../../generated/prisma/client.ts";


export class PrismaAccountRepository implements IAccountRepository {

  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) { }

  async create(account: Account): Promise<Account> {

  }

  // resto de métodos...
}