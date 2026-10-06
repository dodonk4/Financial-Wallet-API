import { DomainEvent } from "./DomainEvent";

export class TransactionReversed implements DomainEvent{
   readonly eventName = "transaction.reversed";
   readonly occurredAt = new Date();

   constructor(
    public readonly originalTransactionId: string,
    public readonly reversalTransactionId: string,
    public readonly reason: string,
    public readonly adminId: string,
   ){}
}