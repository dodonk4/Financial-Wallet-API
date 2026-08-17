export interface ITokenHasher {
  hash(token: string): Promise<string>;

  verify(token: string, hash: string): Promise<boolean>;
}