import { AppError } from "./AppError.ts";

export class RefreshTokenNotFoundError extends AppError {
  constructor() {
    super(
      `Refresh Token not found.`,
      404,
      "REFRESH_TOKEN_NOT_FOUND",
    );
  }
}