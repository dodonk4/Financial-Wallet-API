import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { IRefreshTokenRepository } from "../../../../application/ports/output/IRefreshTokenRepository";
import { RefreshToken } from "../../../../domain/entities/RefreshToken";
import { RefreshTokenNotFoundError } from "../../../../domain/errors/RefreshTokenNotFoundError";


export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) { }

    async save(refreshToken: RefreshToken): Promise<void> {
        await this.prisma.refreshToken.create({
            data: {
                userId: refreshToken.userId,
                tokenHash: refreshToken.tokenHash,
                familyId: refreshToken.familyId,
                expiresAt: refreshToken.expiresAt,
                deviceInfo: refreshToken.deviceInfo,
            }
        })
    }

    async consumeById(id: string): Promise<number> {

        const rowCount = await this.prisma.$executeRaw`
            UPDATE refresh_tokens
            SET used = true
            WHERE id = ${id}
                AND used = false
                AND revoked = false
        `

        return rowCount;
    }

    async findById(id: string): Promise<RefreshToken | null> {
        const refreshToken = await this.prisma.refreshToken.findUnique({ where: { id } });

        if (!refreshToken) {
            throw new RefreshTokenNotFoundError();
        }

        const refreshTokenToReturn = RefreshToken.reconstitute(refreshToken);

        return refreshTokenToReturn;
    }

    async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
        const refreshToken = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

        if (!refreshToken) {
            throw new RefreshTokenNotFoundError();
        }

        const refreshTokenToReturn = RefreshToken.reconstitute(refreshToken);

        return refreshTokenToReturn;
    }

    async revokeManyByFamilyId(familyId: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: { familyId },
            data: {
                revoked: true,
            }
        })
    }

}