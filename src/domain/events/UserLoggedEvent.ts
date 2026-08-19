import { DomainEvent } from "./DomainEvent.ts";

export class userLoggedEvent implements DomainEvent {
  readonly eventName = "user.logged";
  readonly occurredAt = new Date();

  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}