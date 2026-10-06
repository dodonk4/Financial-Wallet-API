import { DomainEvent } from "./DomainEvent.ts";

export class UserRegisteredEvent implements DomainEvent {
  readonly eventName = "user.registered";
  readonly occurredAt = new Date();

  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}