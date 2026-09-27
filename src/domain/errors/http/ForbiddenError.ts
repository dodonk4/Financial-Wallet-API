import { AppError } from "../AppError.ts";

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(
      message,
      403,
      "FORBIDDEN",
    );
  }
}