import { Currency } from "../../../domain/entities/Currency"

export interface TransactionPayload {
    originAccountId: string,
    destinyAccountId: string,
    amount: number,
    currency: Currency,
    description: string | null,
}

export interface IIdempotencyStore {
    saveIdempotencyKey(idempotencyKey: string, payload: TransactionPayload): Promise<string>

    searchIdempotencyKey(idempotencyKey: string): Promise<string>
}