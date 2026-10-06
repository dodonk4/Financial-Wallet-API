import { DomainEvent } from "./DomainEvent";

export class AccountSuspended implements DomainEvent {
  readonly eventName = "account.suspended";
  readonly occurredAt = new Date();

  constructor(
    public readonly accountId: string,
    public readonly userId: string,
    public readonly adminId: string,
    public readonly reason: string,
  ) {}
}