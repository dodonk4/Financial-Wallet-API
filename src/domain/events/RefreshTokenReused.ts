import { DomainEvent } from "./DomainEvent";

export class RefreshTokenReused implements DomainEvent {
  readonly eventName = "refresh_token.reuse_detected";
  readonly occurredAt = new Date();

  constructor(
    public readonly userId: string,
    public readonly familyId: string,
    public readonly ipAddress: string,
  ) {}
}