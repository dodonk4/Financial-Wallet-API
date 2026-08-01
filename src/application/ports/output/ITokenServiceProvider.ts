export interface ITokenServiceProvider {
  generateAccessToken(userId: string, role: string): Promise<string>;

  generateRefreshToken(userId: string): Promise<string>;
}