import { randomUUID } from "node:crypto";
import { Account } from "../../../../domain/entities/Account";
import extractToken from "../../../../interfaces/http/auth/extractToken";
import { IAccountRepository } from "../../../ports/output/IAccountRepository";
import { ITokenServiceProvider } from "../../../ports/output/ITokenServiceProvider";
import { IUnitOfWork } from "../../../ports/output/IUnitOfWork";
import { CreateAdditionalAccountRequestDTO } from "./CreateAdditionalAccountRequestDTO";
import { CreateAdditionalAccountResponseDTO } from "./CreateAdditionalAccountResponseDTO";

export class CreateAdditionalAccountUseCase {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly accountRepository: IAccountRepository,
        private readonly tokenServiceProvider: ITokenServiceProvider,
    ) { }

    async execute(dto: CreateAdditionalAccountRequestDTO, authHeader: string): Promise<CreateAdditionalAccountResponseDTO> {
        const token = extractToken(authHeader);

        const decoded = await this.tokenServiceProvider.decodeToken(token);

        if (!decoded?.sub) {
            throw new Error("There's no user in decoded token");
        }

        //type conflict solving
        if(typeof decoded.sub === 'function'){
            throw new Error("Decoded.sub returns a function instead of a string");
        }

        const userId = decoded.sub;

        const accounts = await this.accountRepository.findAllUserAccounts(userId as string);

        for (const account of accounts) {
            if(account.currency === dto.currency){
                throw new Error("A new account with the same currency as an existing user account cannot be created");
            }
        }

        const response = await this.unitOfWork.execute(async (repositories) => {
            const newAccount = Account.create({
                id: randomUUID(),
                userId,
                currency: dto.currency,
            })
            
            const persistedAccount = await repositories.account.create(newAccount);

            const reconstitutedPersistedAccount = Account.reconstitute(persistedAccount.getProps);

            return reconstitutedPersistedAccount;
        })

        const {balanceCache: __balanceCache, heldBalance: __heldBalance, ...cleanedResponse} = response.getProps;

        return cleanedResponse;

    }
}