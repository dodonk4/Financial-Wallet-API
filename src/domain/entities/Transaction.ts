import { TransactionStatus } from "./TransactionStatus";
import { TransactionType } from "./TransactionType";

export interface TransactionProps {
    id: string,
    type: TransactionType,
    status: TransactionStatus,
    amount: number,
    currency: number,
    idempotencyKey: string,
    relatedTransactionId: string,
    description: string,
    createdAt: Date,
    completedAt: Date,
}