import { Currency } from "../../../../domain/entities/Currency";

export interface TransferServiceRequestDTO {
    originAccountId: string,
    destinyAccountId: string,
    amount: number,
    currency: Currency,
    description: string | null,
    idempotencyKey: string,
}