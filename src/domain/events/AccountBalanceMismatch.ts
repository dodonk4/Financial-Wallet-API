import { DomainEvent } from "./DomainEvent";

export class AccountBalanceMismatch implements DomainEvent {
  readonly eventName = "account.balance_mismatch_detected";
  readonly occurredAt = new Date();

  constructor(
    public readonly accountId: string,
    public readonly expectedBalance: number,
    public readonly actualCachedBalance: number,
    public readonly discrepancy: number,
  ) {}
}