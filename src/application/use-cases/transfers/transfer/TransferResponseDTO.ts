import { Decimal } from "@prisma/client/runtime/client";
import { TransactionStatus } from "../../../../domain/entities/TransactionStatus";
import { TransactionType } from "../../../../domain/entities/TransactionType";
import { Currency } from "../../../../domain/entities/Currency";

export interface TransferServiceResponseDTO {
    id: string;
    type: TransactionType;
    status: TransactionStatus;
    amount: number | Decimal;
    currency: Currency;
    idempotencyKey: string;
    relatedTransactionId: string | null;
    description: string | null;
    createdAt: Date;
    completedAt: Date;
}
