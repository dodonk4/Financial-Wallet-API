import { AppError } from "../AppError.ts";

export class TransactionNotFound extends AppError {
  constructor() {
    super(
      `Transaction not found.`,
      404,
      "TRANSACTION_NOT_FOUND",
    );
  }
}