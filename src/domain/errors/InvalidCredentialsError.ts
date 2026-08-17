import { AppError } from "./AppError.ts";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(
      `Invalid credentials.`,
      401,
      "INVALID_CREDENTIALS",
    );
  }
}