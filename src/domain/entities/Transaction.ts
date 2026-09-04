import { TransactionStatus } from "./TransactionStatus";
import { TransactionType } from "./TransactionType";

export interface TransactionProps {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: number;
  idempotencyKey: string;
  relatedTransactionId: string;
  description: string;
  createdAt: Date;
  completedAt: Date;
}

export class Transaction {
  private constructor(private readonly props: TransactionProps) {}

  static create(props: {
    id: string,
    type: TransactionType;
    amount: number;
    currency: number;
    idempotencyKey: string;
    relatedTransactionId: string;
    description: string;
  }): Transaction {
    return new Transaction({
      ...props,
      status: TransactionStatus.PENDING,
      createdAt: new Date(),
      completedAt: new Date()
    });
  }

  static reconstitute(props: TransactionProps): Transaction{
    return new Transaction(props);
  }

  get id(): string {
    return this.props.id;
  }

  get type(): TransactionType {
    return this.props.type;
  }

  get status(): TransactionStatus {
    return this.props.status;
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): number {
    return this.props.currency;
  }

  get idempotencyKey(): string {
    return this.props.idempotencyKey;
  }

  get relatedTransactionId(): string {
    return this.props.relatedTransactionId;
  }

  get description(): string {
    return this.props.description;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get completedAt(): Date {
    return this.props.completedAt;
  }

}
