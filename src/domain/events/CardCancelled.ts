import { DomainEvent } from "./DomainEvent";

export class CardCancelled implements DomainEvent {
  readonly eventName = "card.cancelled";
  readonly occurredAt = new Date();

  constructor(
    public readonly cardId: string,
    public readonly accountId: string,
    public readonly userId: string,
  ) {}
}