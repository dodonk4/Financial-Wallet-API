import { IIdempotencyStore } from "../../../../application/ports/output/IIdempotencyStore";
import Redis from "ioredis";
import { ITokenHasher } from "../../../../application/ports/output/ITokenHasher";
import { IdempotencyValueSaved } from "../../../../application/use-cases/transfers/transfer/TransferUseCase";

export class RedisIdempotencyStore implements IIdempotencyStore {
  constructor(
    private readonly redis: Redis,
    private readonly hasherProvider: ITokenHasher
  ) { }

  async saveIdempotencyKey(idempotencyKey: string, value: IdempotencyValueSaved): Promise<string> {

    const { secretPayload, response } = value;

    const hashedPayload = await this.hasherProvider.hash(secretPayload);

    const valueToSave = {
      secretPayload: hashedPayload,
      response,
    }

    const result = await this.redis.set("idempotencyKey:" + idempotencyKey, JSON.stringify(valueToSave));
    await this.redis.expire("idempotencyKey:" + idempotencyKey, 86400);//24 hours

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
