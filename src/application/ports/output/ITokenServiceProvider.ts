import type { User } from "../../../domain/entities/User.ts";
import { AccessTokenPayload } from "./token/AccessTokenPayload.ts";
import { GeneratedTokens } from "./token/GeneratedTokens.ts";
import { RefreshTokenPayload } from "./token/RefreshTokenPayload.ts";

export interface ITokenServiceProvider {
  generate(user: User): Promise<GeneratedTokens>;

  verifyAccessToken(token: string): Promise<AccessTokenPayload>;

  verifyRefreshToken(token: string): Promise<RefreshTokenPayload>;
}