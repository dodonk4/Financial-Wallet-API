import { LedgerEntryDirection } from "./LedgerEntryDirection";

export interface LedgerEntryProps {
  id: string;
  transactionId: string;
  accountId: string;
  direction: LedgerEntryDirection;
  amount: number;
  balanceAfter: number;
  createdAt: Date;
}

export class LedgerEntry {
  private constructor(private readonly props: LedgerEntryProps) {}

  static create(props: {
    id: string,
    transactionId: string,
    accountId: string,
    direction: LedgerEntryDirection,
    amount: number,
    balanceAfter: number,
  }): LedgerEntry {
    return new LedgerEntry({
        ...props,
        createdAt: new Date()
    })
  }

  get id(): string {
    return this.props.id;
  }

  get transactionId(): string {
    return this.props.transactionId;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get direction(): LedgerEntryDirection {
    return this.props.direction;
  }

  get amount(): number {
    return this.props.amount;
  }

  get balanceAfter(): number {
    return this.props.balanceAfter;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
