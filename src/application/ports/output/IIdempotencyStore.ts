import { Transaction } from "../../../domain/entities/Transaction";

export interface IIdempotencyStore{
    searchIdempotencyKey(idempotencyKey: string): Promise<Transaction>
}