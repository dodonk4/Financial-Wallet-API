import { DomainEvent } from "./DomainEvent";

export class CardBlocked implements DomainEvent {
  readonly eventName = "card.blocked";
  readonly occurredAt = new Date();

  constructor(
    public readonly cardId: string,
    public readonly accountId: string,
    public readonly userId: string,
    public readonly triggeredBy: "USER" | "ADMIN",
  ) {}
}