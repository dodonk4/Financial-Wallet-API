import { Decimal } from "@prisma/client/runtime/client";
import { AccountStatus } from "./AccountStatus";
import { Currency } from "./Currency";

export interface AccountProps {
  id: string;
  userId: string;
  currency: Currency;
  balanceCache: number | Decimal;
  heldBalance: number | Decimal;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Account {
  private constructor(
    private readonly props: AccountProps,
  ) {}

  static create(props: {
    id: string;
    userId: string;
    currency: Currency;
  }): Account {

    return new Account({
      ...props,
      balanceCache: 0,
      heldBalance: 0,
      status: AccountStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  }

  static reconstitute(props: AccountProps): Account {
    return new Account(props);
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get balanceCache() {
    return Number(this.props.balanceCache);
  }

  get heldBalance() {
    return Number(this.props.heldBalance);
  }

  get currency() {
    return this.props.currency;
  }

  get status() {
    return this.props.status;
  }
}