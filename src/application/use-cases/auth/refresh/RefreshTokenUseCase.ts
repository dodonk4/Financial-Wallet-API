import { randomUUID } from "node:crypto";
import { RefreshToken } from "../../../../domain/entities/RefreshToken";
import { UnauthorizedError } from "../../../../domain/errors/http/UnauthorizedError";
import { NotFoundError } from "../../../../domain/errors/http/NotFoundError";
import { ITokenHasher } from "../../../ports/output/ITokenHasher";
import { ITokenServiceProvider } from "../../../ports/output/ITokenServiceProvider";
import { IUnitOfWork } from "../../../ports/output/IUnitOfWork";
import { RefreshTokenRequestDTO } from "./RefreshTokenRequestDTO";
import { RefreshTokenResponseDTO } from "./RefreshTokenResponseDTO";

export class RefreshTokenUseCase {
    constructor(
        private readonly tokenServiceProvider: ITokenServiceProvider,
        private readonly tokenHasher: ITokenHasher,
        private readonly unitOfWork: IUnitOfWork,
    ) { }

    async execute(dto: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {

        if(!dto.authorization){
            throw new UnauthorizedError("Invalid credentials.");
        }

        const newTokens = await this.unitOfWork.execute(async (repositories) => {

            const payload = await this.tokenServiceProvider.verifyRefreshToken(dto.authorization);

            const user = await repositories.user.findById(payload.sub);

            if (!user) {
                throw new NotFoundError("User not found.");
            }

            const tokenHash = await this.tokenHasher.hash(dto.authorization);

            const refreshToken = await repositories.refreshToken.findByTokenHash(tokenHash);

            if (!refreshToken) {
                throw new NotFoundError("Refresh Token not found.");
            }

            if (refreshToken?.revoked) {
                throw new UnauthorizedError("The token provided is nvalid, expired, revoked or used");
            }

            if (refreshToken?.used) {

                await repositories.refreshToken.revokeManyByFamilyId(refreshToken.familyId);

                throw new UnauthorizedError("The token provided is nvalid, expired, revoked or used");
            }

            const rowCount = await repositories.refreshToken.consumeById(refreshToken.id);

            if (!rowCount) {

                await repositories.refreshToken.revokeManyByFamilyId(refreshToken.familyId);

                throw new UnauthorizedError("The token provided is nvalid, expired, revoked or used");

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