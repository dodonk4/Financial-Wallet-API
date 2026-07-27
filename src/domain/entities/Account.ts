import { Decimal } from "@prisma/client/runtime/client";
import { AccountStatus } from "./AccountStatus";
import { Currency } from "./Currency";

export interface AccountProps {
  id: string;
  userId: string;
  currency: Currency;
  balanceCache: Decimal;
  heldBalance: Decimal;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Account {
  constructor(private readonly props: AccountProps) {}

  get id() {
    return this.props.id;
  }

  get heldBalance() {
    return this.props.heldBalance;
  }

  // ...
}