import { RefreshToken } from "../../../domain/entities/RefreshToken";

export interface IRefreshTokenRepository {
  save(refreshToken: RefreshToken): Promise<void>;

  consumeById(id: string): Promise<number>;

  findById(id: string): Promise<RefreshToken | null>;

  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;

  revokeManyByFamilyId(familyId: string): Promise<void>;
}