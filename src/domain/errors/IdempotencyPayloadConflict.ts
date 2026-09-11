import { AppError } from "./AppError";

export class IdempotencyPayloadConflictError extends AppError {
  constructor() {
    super(
      "The idempotency key was already used with a different payload.",
      409,
      "IDEMPOTENCY_PAYLOAD_CONFLICT",
    );
  }
}