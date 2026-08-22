import { randomUUID } from "node:crypto";
import { RefreshToken } from "../../../../domain/entities/RefreshToken";
import { NonValidRefreshTokenError } from "../../../../domain/errors/NonValidRefreshTokenError";
import { RefreshTokenNotFoundError } from "../../../../domain/errors/RefreshTokenNotFoundError";
import { UserNotFound } from "../../../../domain/errors/UserNotFoundError";
import { ITokenHasher } from "../../../ports/output/ITokenHasher";
import { ITokenServiceProvider } from "../../../ports/output/ITokenServiceProvider";
import { IUnitOfWork } from "../../../ports/output/IUnitOfWork";
import { RefreshTokenRequestDTO } from "./RefreshTokenRequestDTO";
import { RefreshTokenResponseDTO } from "./RefreshTokenResponseDTO";
import { InvalidCredentialsError } from "../../../../domain/errors/InvalidCredentialsError";

export class RefreshTokenUseCase {
    constructor(
        private readonly tokenServiceProvider: ITokenServiceProvider,
        private readonly tokenHasher: ITokenHasher,
        private readonly unitOfWork: IUnitOfWork,
    ) { }

    async execute(dto: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {

        if(!dto.authorization){
            throw new InvalidCredentialsError();
        }

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