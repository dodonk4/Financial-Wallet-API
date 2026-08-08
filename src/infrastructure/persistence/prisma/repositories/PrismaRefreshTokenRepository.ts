import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { IRefreshTokenRepository } from "../../../../application/ports/output/IRefreshTokenRepository";
import { RefreshToken } from "../../../../domain/entities/RefreshToken";


export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient ) {}

    async save(refreshToken: RefreshToken): Promise<void>{
        
    }
}