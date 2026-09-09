import { Account } from "../../../domain/entities/Account";
import { Direction } from "../../../domain/entities/Direction";

export interface IAccountRepository {
  create(account: Account): Promise<Account>;

  findById(id: string): Promise<Account>;

  updateAmountById(id: string, amount: number, direction: Direction): Promise<Account>
}