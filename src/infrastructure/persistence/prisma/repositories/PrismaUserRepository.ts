import { Prisma, PrismaClient } from "../../../../../generated/prisma/client.ts";
import { IUserRepository } from "../../../../application/ports/output/IUserRepository.ts";
import { User } from "../../../../domain/entities/User.ts";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) { }

  async existsByEmail(email: string): Promise<boolean> {

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user !== null;
  }

  async existsByDocument(identifierType: string, identifierNumber: number): Promise<boolean> {

    const user = await this.prisma.user.findUnique({
      where: {
        identifierType_identifierNumber: {
          identifierType: identifierType,
          identifierNumber: identifierNumber,
        },
      }
    })

    return user !== null;

  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash: user.passwordHash,
        identifierType: user.identifierType,
        identifierNumber: user.identifierNumber,
        role: user.role,
      },
    });

    const newCreatedUser = User.create({
      id: createdUser.id,
      email: createdUser.email,
      passwordHash: createdUser.passwordHash,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      identifierType: createdUser.identifierType,
      identifierNumber: createdUser.identifierNumber,
    })

    return newCreatedUser;
  }

  async findById(id: string): Promise<User | null> {

  }

}