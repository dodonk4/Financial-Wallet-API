import { RefreshToken } from "../../../domain/entities/RefreshToken";

export interface IRefreshTokenRepository {
  save(refreshToken: RefreshToken): Promise<void>;
}