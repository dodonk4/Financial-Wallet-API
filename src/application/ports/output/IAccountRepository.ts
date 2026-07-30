import { Account } from "../../../domain/entities/Account";

export interface IAccountRepository {
  create(account: Account): Promise<Account>;
}