import { AppError } from "./AppError.ts";

export class RefreshTokenAlreadyRevokedError extends AppError {
  constructor() {
    super(
      `The token cannot be revoked because it has been already revoked`,
      409,
      "REFRESH_TOKEN_ALREADY_REVOKED",
    );
  }
}