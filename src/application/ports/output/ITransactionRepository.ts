import { Transaction } from "../../../domain/entities/Transaction";
import { TransactionStatus } from "../../../domain/entities/TransactionStatus";

export interface ITransactionRepository{
    create(transaction: Transaction): Promise<Transaction>

    findById(id: string): Promise<Transaction | null>

    updateStatusById(id: string, status: TransactionStatus): Promise<Transaction | null>

    findByIdempotencyKey(idempotencyKey: string): Promise<Transaction | null>
}