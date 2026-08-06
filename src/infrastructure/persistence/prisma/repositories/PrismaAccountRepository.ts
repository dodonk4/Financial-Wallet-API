import { prisma } from "../../../database/prisma.ts";
import { IAccountRepository } from "../../../../application/ports/output/IAccountRepository.ts";
import { Account } from "../../../../domain/entities/Account.ts";

export class PrismaAccountRepository implements IAccountRepository {

    async create(account: Account): Promise<Account> {
        
    }

  // resto de métodos...
}