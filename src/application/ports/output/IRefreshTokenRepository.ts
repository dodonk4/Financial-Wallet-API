export interface IRefreshTokenRepository {
  save(userId: string, token: string): Promise<void>;
}