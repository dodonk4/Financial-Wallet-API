import { Transaction } from "../../../domain/entities/Transaction";
import { TransactionStatus } from "../../../domain/entities/TransactionStatus";

export interface ITransactionRepository{
    create(transaction: Transaction): Promise<Transaction>

    findById(id: string): Promise<Transaction>

    updateStatusById(id: string, status: TransactionStatus): Promise<Transaction>
}