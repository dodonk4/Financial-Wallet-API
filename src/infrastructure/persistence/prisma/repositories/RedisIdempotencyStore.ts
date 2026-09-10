import { IIdempotencyStore, TransactionPayload } from "../../../../application/ports/output/IIdempotencyStore";
import Redis from "ioredis";
import { ITokenHasher } from "../../../../application/ports/output/ITokenHasher";

export class RedisIdempotencyStore implements IIdempotencyStore {
  constructor(
    private readonly redis: Redis,
    private readonly hasherProvider: ITokenHasher
  ) { }

  async saveIdempotencyKey(idempotencyKey: string, paylaod: TransactionPayload): Promise<string> {

    const hashedPayload = await this.hasherProvider.hash(JSON.stringify(paylaod));

    const result = await this.redis.set("idempotencyKey:" + idempotencyKey, hashedPayload);

    if (!result) {
      throw new Error("An error occured while saving the idempotencyKey");
    }

    return result;
  }

  async searchIdempotencyKey(idempotencyKey: string): Promise<string | null> {
    const payload = await this.redis.get("idempotencyKey:" + idempotencyKey);

    return payload;
  }
}
