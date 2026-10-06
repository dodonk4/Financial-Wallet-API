import { DomainEvent } from "./DomainEvent";

export class UserLoginFailed implements DomainEvent{
    readonly eventName = "user.login.failed.threshold_reached";
    readonly occurredAt = new Date();

    constructor(
        public readonly userId: string,
        public readonly email: string,
        //public readonly ipAdress: string,
    ){}
}