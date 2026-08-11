import { User } from "../../../domain/entities/User.ts";


export interface IUserRepository {
  existsByEmail(email: string): Promise<boolean>;

  existsByDocument(
    documentType: string,
    documentNumber: number
  ): Promise<boolean>;

  create(user: User): Promise<User>;

  findById(id: string): Promise<User | null>;
}