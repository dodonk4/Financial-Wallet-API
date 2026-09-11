import { IdempotencyValueSaved } from "../../use-cases/transfers/transfer/TransferUseCase"
export interface IIdempotencyStore {
    /**
     * It hashes the payload. It doesn't need to recieve the payload hashed
     * @param idempotencyKey 
     * @param paylaod 
     * @returns 
     */
    saveIdempotencyKey(idempotencyKey: string, value: IdempotencyValueSaved): Promise<string>

    searchIdempotencyKey(idempotencyKey: string): Promise<string | null>
}