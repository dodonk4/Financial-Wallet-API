import { AppError } from "./AppError.ts";

export class UserNotFound extends AppError {
  constructor() {
    super(
      `User not found.`,
      404,
      "USER_NOT_FOUND",
    );
  }
}