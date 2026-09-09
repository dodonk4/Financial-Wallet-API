import { AppError } from "./AppError.ts";

export class InsufficientBalance extends AppError {
  constructor() {
    super(
      `The amount is greater than the account balance`,
      422,
      "INSUFICIENT_BALANCE",
    );
  }
}