import { AppError } from "./AppError.ts";

export class AccountNotFound extends AppError {
  constructor() {
    super(
      `Account not found.`,
      404,
      "ACCOUNT_NOT_FOUND",
    );
  }
}