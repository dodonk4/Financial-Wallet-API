import { RedisClient } from "bullmq";
import { IIdempotencyStore } from "../../../../application/ports/output/IIdempotencyStore";
import { Transaction } from "../../../../domain/entities/Transaction";

export class RedisIdempotencyStore implements IIdempotencyStore {
  constructor(private readonly redis: RedisClient) {}

  async saveIdempotencyKey(idempotencyKey: string, paylaod: Transaction): Promise<string> {

    const stringifyPayload = JSON.stringify(paylaod);

    const result = await this.redis.set(idempotencyKey, stringifyPayload);

    if(!result){
        throw new Error("An error occured while saving the idempotencyKey");
    }

    return result;
  }

  async searchIdempotencyKey(idempotencyKey: string): Promise<Transaction> {
    const payload = await this.redis.get(idempotencyKey);

    const transaction: Transaction | null = payload
      ? JSON.parse(payload)
      : null;

    if (!transaction) {
      throw new Error("There's no transaction found"); //Replace error
    }

    return transaction;
  }
}
