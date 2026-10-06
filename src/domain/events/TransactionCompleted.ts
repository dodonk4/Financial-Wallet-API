import { DomainEvent } from "./DomainEvent";

import { Currency } from "../entities/Currency";

export class TransactionCompleted implements DomainEvent {
  readonly eventName = "transaction.completed";
  readonly occurredAt = new Date();

  constructor(
    public readonly transactionId: string,
    public readonly originAccountId: string,
    public readonly destinationAccountId: string,
    public readonly amount: number,
    public readonly currency: Currency,
  ) {}
}