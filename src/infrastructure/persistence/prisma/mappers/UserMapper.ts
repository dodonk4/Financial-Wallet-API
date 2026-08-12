import { User as PrismaUser } from "../../../../../generated/prisma/client.ts";
import { User } from "../../../../domain/entities/User.ts";

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.reconstitute({
      id: prismaUser.id,
      email: prismaUser.email,
      passwordHash: prismaUser.passwordHash,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      identifierType: prismaUser.identifierType,
      identifierNumber: prismaUser.identifierNumber,
      role: prismaUser.role,
      status: prismaUser.status,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}
