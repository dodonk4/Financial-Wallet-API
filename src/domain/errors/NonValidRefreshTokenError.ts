import { AppError } from "./AppError.ts";

export class NonValidRefreshTokenError extends AppError {
  constructor() {
    super(
      `The token provided is nvalid, expired, revoked or used`,
      401,
      "INVALID_REFRESH_TOKEN",
    );
  }
}