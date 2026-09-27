import { ConflictError } from "../../../../domain/errors/http/ConflictError";
import { UnauthorizedError } from "../../../../domain/errors/http/UnauthorizedError";
import { RefreshTokenNotFoundError } from "../../../../domain/errors/404/RefreshTokenNotFoundError";
import { ITokenHasher } from "../../../ports/output/ITokenHasher";
import { IUnitOfWork } from "../../../ports/output/IUnitOfWork";
import { LogoutRequestDTO } from "./LogoutRequestDTO";

export class LogoutUseCase {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly tokenHasher: ITokenHasher,
    ) { }

    async execute(dto: LogoutRequestDTO) {    

        if (!dto.authorization) {
            throw new UnauthorizedError("Invalid credentials.");
        }

        await this.unitOfWork.execute(async (repositories) => {
            const tokenHash = await this.tokenHasher.hash(dto.authorization);

            const refreshTokenToRevoke = await repositories.refreshToken.findByTokenHash(tokenHash);

            if (!refreshTokenToRevoke) {
                throw new RefreshTokenNotFoundError();
            }

            if(refreshTokenToRevoke.revoked === true){
                throw new ConflictError("The token cannot be revoked because it has been already revoked");
            }

            await repositories.refreshToken.revoke(refreshTokenToRevoke.id);

        })
    }
}