import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { ILedgerEntryRepository } from "../../../../application/ports/output/ILedgerEntryRepository";
import { LedgerEntry } from "../../../../domain/entities/LedgerEntry";

export class PrismaLedgerEntryRepository implements ILedgerEntryRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) { }

    async create(ledgerEntry: LedgerEntry): Promise<LedgerEntry> {
        const prismaCreatedLedgerEntry = await this.prisma.ledgerEntry.create({
            data: {
                id: ledgerEntry.id,
                transactionId: ledgerEntry.transactionId,
                accountId: ledgerEntry.accountId,
                direction: ledgerEntry.direction,
                amount: ledgerEntry.amount,
                balanceAfter: ledgerEntry.balanceAfter,
                createdAt: ledgerEntry.createdAt,
            }
        });

        const createdLedgerEntry = LedgerEntry.reconstitute(prismaCreatedLedgerEntry);

        return createdLedgerEntry;

    }
}