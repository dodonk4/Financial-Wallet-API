import { AccountStatus } from "./AccountStatus";
import { Currency } from "./Currency";

export interface AccountProps {
  id: string;
  userId: string;
  currency: Currency;
  balance: number;
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
      balance: 0,
      status: AccountStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  }

  static restore(props: AccountProps): Account {
    return new Account(props);
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get balance() {
    return this.props.balance;
  }

  get currency() {
    return this.props.currency;
  }

  get status() {
    return this.props.status;
  }
}