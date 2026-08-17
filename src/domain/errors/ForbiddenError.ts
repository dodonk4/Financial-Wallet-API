import { AppError } from "./AppError.ts";

export class ForbiddenError extends AppError {
  constructor() {
    super(
      `Forbidden`,
      403,
      "FORBIDDEN",
    );
  }
}