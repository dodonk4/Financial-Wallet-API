import { Decimal } from "@prisma/client/runtime/client";
import { Direction } from "./Direction";

export interface LedgerEntryProps {
  id: string;
  transactionId: string;
  accountId: string;
  direction: Direction;
  amount: number | Decimal;
  balanceAfter: number | Decimal;
  createdAt: Date;
}

export class LedgerEntry {
  private constructor(private readonly props: LedgerEntryProps) { }

  static create(props: {
    id: string,
    transactionId: string,
    accountId: string,
    direction: Direction,
    amount: number,
    balanceAfter: number,
  }): LedgerEntry {
    return new LedgerEntry({
      ...props,
      createdAt: new Date()
    })
  }

  static reconstitute(props: LedgerEntryProps): LedgerEntry {

    props.amount = Number(props.amount)
    props.balanceAfter = Number(props.balanceAfter);

    return new LedgerEntry(props);
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

  get direction(): Direction {
    return this.props.direction;
  }

  get amount(): number {
    return Number(this.props.amount);
  }

  get balanceAfter(): number {
    return Number(this.props.balanceAfter);
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
