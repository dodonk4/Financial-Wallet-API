import { AppError } from "./AppError.ts";

export class DocumentAlreadyExistsError extends AppError {
  constructor(document: string) {
    super(
      `A user with document "${document}" already exists.`,
      409,
      "DOCUMENT_ALREADY_EXISTS",
    );
  }
}