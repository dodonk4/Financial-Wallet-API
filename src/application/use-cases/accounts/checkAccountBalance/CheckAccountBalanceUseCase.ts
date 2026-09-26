import { ForbiddenError } from "../../../../domain/errors/ForbiddenError";
import extractToken from "../../../../interfaces/http/auth/extractToken";
import { IAccountRepository } from "../../../ports/output/IAccountRepository";
import { ITokenServiceProvider } from "../../../ports/output/ITokenServiceProvider";
import { CheckAccountBalanceRequestDTO } from "./CheckAccountBalanceRequestDTO";
import { CheckAccountBalanceResponseDTO } from "./CheckAccountBalanceResponseDTO";

export class CheckAccountBalanceUseCase {
    constructor(
        private readonly accountRepository: IAccountRepository,
        private readonly tokenServiceProvider: ITokenServiceProvider) { }

    async execute(dto: CheckAccountBalanceRequestDTO, authHeader: string): Promise<CheckAccountBalanceResponseDTO> {

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