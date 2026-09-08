import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { ITransactionRepository } from "../../../../application/ports/output/ITransactionRepository";
import { Transaction } from "../../../../domain/entities/Transaction";

export class PrismaTransactionRepository implements ITransactionRepository {
    private constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) { }

    async create(transaction: Transaction): Promise<Transaction> {
        const prismaCreatedTransaction = await this.prisma.transaction.create({
            data: {
                id: transaction.id,
                type: transaction.type,
                amount: transaction.amount,
                currency: transaction.currency,
                idempotencyKey: transaction.idempotencyKey,
                status: transaction.status,
                description: transaction.description,
                relatedTransactionId: transaction.relatedTransactionId,
                createdAt: transaction.createdAt,
                completedAt: transaction.completedAt,
            }
        });

        const createdTransaction = Transaction.reconstitute({
            id: prismaCreatedTransaction.id,
            type: prismaCreatedTransaction.type,
            amount: Number(prismaCreatedTransaction.amount),
            currency: prismaCreatedTransaction.currency,
            idempotencyKey: prismaCreatedTransaction.idempotencyKey,
            status: prismaCreatedTransaction.status,
            relatedTransactionId: prismaCreatedTransaction.relatedTransactionId,
            description: prismaCreatedTransaction.description,
            createdAt: prismaCreatedTransaction.createdAt,
            completedAt: prismaCreatedTransaction.completedAt,
        });

        return createdTransaction;
    }
}