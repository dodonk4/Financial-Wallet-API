import { Prisma, PrismaClient } from "../../../../../generated/prisma/client.ts";
import { IUserRepository } from "../../../../application/ports/output/IUserRepository.ts";
import { User } from "../../../../domain/entities/User.ts";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

  async existsByEmail(email: string): Promise<boolean> {

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user !== null;
  }

  async existsByDocument(documentType: string, documentNumber: string): Promise<boolean> {

    const user = await this.prisma.user.findUnique({
      where: {
        identifierType_identifierNumber: {
          identifierType: documentType,
          identifierNumber: documentNumber,
        },
      }
    })

    return user !== null;

  }

  async create(user: User): Promise<User> {

  }

  async findById(id: string): Promise<User | null> {

  }

}