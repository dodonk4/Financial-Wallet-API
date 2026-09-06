import { Transaction } from "../../../domain/entities/Transaction";

export interface IIdempotencyStore{
    saveIdempotencyKey(idempotencyKey: string, payload: Transaction): Promise<string>

    searchIdempotencyKey(idempotencyKey: string): Promise<Transaction>
}