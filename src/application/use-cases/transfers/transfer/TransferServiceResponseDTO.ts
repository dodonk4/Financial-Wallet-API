import { TransactionStatus } from "../../../../domain/entities/TransactionStatus";
import { TransactionType } from "../../../../domain/entities/TransactionType";

export interface TransferServiceResponseDTO {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: number;
  idempotencyKey: string;
  relatedTransactionId: string | null;
  description: string | null;
  createdAt: Date;
  completedAt: Date;
}
