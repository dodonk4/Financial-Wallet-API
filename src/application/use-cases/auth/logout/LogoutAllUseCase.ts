import { InvalidCredentialsError } from "../../../../domain/errors/InvalidCredentialsError";
import { RefreshTokenNotFoundError } from "../../../../domain/errors/RefreshTokenNotFoundError";
import { ITokenHasher } from "../../../ports/output/ITokenHasher";
import { IUnitOfWork } from "../../../ports/output/IUnitOfWork";
import { LogoutRequestDTO } from "./LogoutRequestDTO";

export class LogoutAllUseCase {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly tokenHasher: ITokenHasher,
    ) { }

    async execute(dto: LogoutRequestDTO) {

        if (!dto.authorization) {
            throw new InvalidCredentialsError();
        }

        await this.unitOfWork.execute(async (repositories) => {
            const tokenHash = await this.tokenHasher.hash(dto.authorization);

            const refreshTokenToRevoke = await repositories.refreshToken.findByTokenHash(tokenHash);

            if (!refreshTokenToRevoke) {
                throw new RefreshTokenNotFoundError();
            }

            await repositories.refreshToken.revokeManyByFamilyId(refreshTokenToRevoke.familyId);

        })
    }
}