import { AppError } from "./AppError.ts";

export class CurrencyConflictError extends AppError {
  constructor() {
    super(
      `The currency of the transaction has to be the same as the destiny account`,
      409,
      "CURRENCY_CONFLICT_ERROR",
    );
  }
}