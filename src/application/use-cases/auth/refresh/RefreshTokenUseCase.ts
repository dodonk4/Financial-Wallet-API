import { randomUUID } from "node:crypto";
import { RefreshToken } from "../../../../domain/entities/RefreshToken";
import { NonValidRefreshTokenError } from "../../../../domain/errors/NonValidRefreshTokenError";
import { RefreshTokenNotFoundError } from "../../../../domain/errors/RefreshTokenNotFoundError";
import { UserNotFound } from "../../../../domain/errors/UserNotFoundError";
import { IRefreshTokenRepository } from "../../../ports/output/IRefreshTokenRepository";
import { ITokenHasher } from "../../../ports/output/ITokenHasher";
import { ITokenServiceProvider } from "../../../ports/output/ITokenServiceProvider";
import { IUnitOfWork } from "../../../ports/output/IUnitOfWork";
import { IUserRepository } from "../../../ports/output/IUserRepository";
import { GeneratedTokens } from "../../../ports/output/token/GeneratedTokens";
import { RefreshTokenRequestDTO } from "./RefreshTokenRequestDTO";
import { RefreshTokenResponseDTO } from "./RefreshTokenResponseDTO";

export class RefreshTokenUseCase {
    constructor(
        private readonly tokenServiceProvider: ITokenServiceProvider,
        private readonly tokenHasher: ITokenHasher,
        private readonly userRepository: IUserRepository,
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly unitOfWork: IUnitOfWork,
    ) { }

    async execute(dto: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {

        const newTokens = await this.unitOfWork.execute(async (repositories) => {

            const payload = await this.tokenServiceProvider.verifyRefreshToken(dto.authorization);

            const user = await repositories.user.findById(payload.sub);

            if (!user) {
                throw new UserNotFound();
            }

            const tokenHash = await this.tokenHasher.hash(dto.authorization);

            const refreshToken = await repositories.refreshToken.findByTokenHash(tokenHash);

            if (!refreshToken) {
                throw new RefreshTokenNotFoundError();
            }

            if (refreshToken?.revoked) {
                throw new NonValidRefreshTokenError();
            }

            if (refreshToken?.used) {

                await repositories.refreshToken.revokeManyByFamilyId(refreshToken.familyId);

                throw new NonValidRefreshTokenError();
            }

            const rowCount = await repositories.refreshToken.consumeById(refreshToken.id);

            if (!rowCount) {

                await repositories.refreshToken.revokeManyByFamilyId(refreshToken.familyId);

                throw new NonValidRefreshTokenError();

            }

            const newTokensToReturn = await this.tokenServiceProvider.generate(user);

            const newTokenHash = await this.tokenHasher.hash(newTokensToReturn.refreshToken);

            const newRefreshToken = RefreshToken.create({
                id: randomUUID(),
                userId: user.id,
                tokenHash: newTokenHash,
                familyId: refreshToken.familyId,
                expiresAt: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                ),
                deviceInfo: null,
            });

            await repositories.refreshToken.save(newRefreshToken);

            return newTokensToReturn;

        })

        return {
            refreshToken: newTokens.refreshToken,
            accessToken: newTokens.accessToken,
        }
    }
}