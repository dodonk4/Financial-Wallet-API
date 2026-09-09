import { IIdempotencyStore, TransactionPayload } from "../../../../application/ports/output/IIdempotencyStore";
import Redis from "ioredis";

export class RedisIdempotencyStore implements IIdempotencyStore {
  constructor(private readonly redis: Redis) {}

  async saveIdempotencyKey(idempotencyKey: string, paylaod: TransactionPayload): Promise<string> {

    const stringifyPayload = JSON.stringify(paylaod);

    const result = await this.redis.set(idempotencyKey, stringifyPayload);

    if(!result){
        throw new Error("An error occured while saving the idempotencyKey");
    }

    return result;
  }

  async searchIdempotencyKey(idempotencyKey: string): Promise<string> {
    const payload = await this.redis.get(idempotencyKey);

    if (!payload) {
      throw new Error("There's no transaction found"); //Replace error
    }

    return payload;
  }
}
