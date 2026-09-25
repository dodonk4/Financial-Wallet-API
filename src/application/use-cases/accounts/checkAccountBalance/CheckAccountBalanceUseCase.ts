import { ForbiddenError } from "../../../../domain/errors/ForbiddenError";
import extractToken from "../../../../interfaces/http/auth/extractToken";
import { IAccountRepository } from "../../../ports/output/IAccountRepository";
import { ITokenServiceProvider } from "../../../ports/output/ITokenServiceProvider";
import { CheckAccountBalanceDTORequest } from "./CheckAccountBalanceDTORequest";

export class CheckAccountBalanceUseCase {
    constructor(
        private readonly accountRepository: IAccountRepository,
        private readonly tokenServiceProvider: ITokenServiceProvider) { }

    async execute(dto: CheckAccountBalanceDTORequest, authHeader: string) {

        const token = extractToken(authHeader);

        const decoded = await this.tokenServiceProvider.decodeToken(token);

        const account = await this.accountRepository.findById(dto.accountId);

        if (account.userId != decoded?.sub) {
            throw new ForbiddenError();
        }

        const balanceCache = account.balanceCache;

        return {
            balanceCache
        }

    }
}