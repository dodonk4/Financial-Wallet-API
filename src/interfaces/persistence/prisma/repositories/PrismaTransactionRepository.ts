import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { ITransactionRepository } from "../../../../application/ports/output/ITransactionRepository";
import { Transaction } from "../../../../domain/entities/Transaction";
import { TransactionNotFound } from "../../../../domain/errors/404/TransactionNotFoundError";
import { TransactionStatus } from "../../../../domain/entities/TransactionStatus";

export class PrismaTransactionRepository implements ITransactionRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) { }

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

        const createdTransaction = Transaction.reconstitute(prismaCreatedTransaction);

        return createdTransaction;
    }

    async findById(id: string): Promise<Transaction> {
        const transaction = await this.prisma.transaction.findUnique({ where: { id } });

        if (!transaction) {
            throw new TransactionNotFound();
        }

        const response = Transaction.reconstitute(transaction);

        return response;
    }

    async updateStatusById(id: string, status: TransactionStatus): Promise<Transaction> {
        const transactionUpdated = await this.prisma.transaction.update({ where: { id }, data: {
            status
        } });

        const response = Transaction.reconstitute(transactionUpdated);

        return response;
    }
}