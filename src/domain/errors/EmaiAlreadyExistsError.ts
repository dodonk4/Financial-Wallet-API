import { AppError } from "./AppError.ts";

export class EmailAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(
      `A user with email "${email}" already exists.`,
      409,
      "EMAIL_ALREADY_EXISTS",
    );
  }
}