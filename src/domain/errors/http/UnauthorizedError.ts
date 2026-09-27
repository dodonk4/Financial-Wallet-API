import { AppError } from "../AppError.ts";

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(
      message,
      401,
      "UNAUTHORIZED",
    );
  }
}