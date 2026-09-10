import { Currency } from "../../../domain/entities/Currency"

export interface TransactionPayload {
    originAccountId: string,
    destinyAccountId: string,
    amount: number,
    currency: Currency,
    description: string | null,
}

export interface IIdempotencyStore {
    /**
     * It hashes the payload. It doesn't need to recieve the payload hashed
     * @param idempotencyKey 
     * @param paylaod 
     * @returns 
     */
    saveIdempotencyKey(idempotencyKey: string, payload: TransactionPayload): Promise<string>

    searchIdempotencyKey(idempotencyKey: string): Promise<string | null>
}