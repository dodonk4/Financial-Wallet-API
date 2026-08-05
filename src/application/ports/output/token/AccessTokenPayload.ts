import type { UserRole } from "../../../../domain/entities/UserRole.ts";

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
}