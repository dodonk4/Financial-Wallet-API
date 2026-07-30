export interface ITokenServiceProvider {
  generateAccessToken(userId: string): Promise<string>;

  generateRefreshToken(userId: string): Promise<string>;
}