import { Prisma, PrismaClient } from "../../../../../generated/prisma/client.ts";
import { IUserRepository } from "../../../../application/ports/output/IUserRepository.ts";
import { User } from "../../../../domain/entities/User.ts";
import { UserNotFound } from "../../../../domain/errors/UserNotFoundError.ts";

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
    const prismaCreatedUser = await this.prisma.user.create({
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

    const createdUser = User.create({
      id: prismaCreatedUser.id,
      email: prismaCreatedUser.email,
      passwordHash: prismaCreatedUser.passwordHash,
      firstName: prismaCreatedUser.firstName,
      lastName: prismaCreatedUser.lastName,
      identifierType: prismaCreatedUser.identifierType,
      identifierNumber: prismaCreatedUser.identifierNumber,
    })

    return createdUser;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if(!user){
      throw new UserNotFound();
    }

    const userToReturn = User.reconstitute(user);

    return userToReturn;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if(!user){
      throw new UserNotFound();
    }

    const userToReturn = User.reconstitute(user);

    return userToReturn;
  }

}