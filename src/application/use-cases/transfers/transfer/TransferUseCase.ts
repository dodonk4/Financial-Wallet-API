import { Transaction } from "../../../../domain/entities/Transaction";
import { IIdempotencyStore } from "../../../ports/output/IIdempotencyStore";
import { ITokenHasher } from "../../../ports/output/ITokenHasher";
import { TransferServiceRequestDTO } from "./TransferRequestDTO";
import { TransferServiceResponseDTO } from "./TransferResponseDTO";
import { IUnitOfWork } from "../../../ports/output/IUnitOfWork";
import { randomUUID } from "node:crypto";
import { LedgerEntry } from "../../../../domain/entities/LedgerEntry";
import { CurrencyConflictError } from "../../../../domain/errors/CurrencyConflict";
import { InsufficientBalance } from "../../../../domain/errors/InsufficientBalance";
import { IdempotencyPayloadConflictError } from "../../../../domain/errors/IdempotencyPayloadConflict";
import { ITransactionRepository } from "../../../ports/output/ITransactionRepository";

export interface IdempotencyValueSaved {
    secretPayload: string,
    response: string,
}

export class TransferUsecase {
    constructor(
        private readonly idempotencyStore: IIdempotencyStore,
        private readonly hashProvider: ITokenHasher,
        private readonly unitOfWork: IUnitOfWork,
        private readonly transactionRepository: ITransactionRepository,
    ) { }

    async execute(dto: TransferServiceRequestDTO): Promise<TransferServiceResponseDTO> {
        //The idempotency search can be outside the UnitOfWork

        const { idempotencyKey, ...payloadData } = dto;

        const currentPayload = payloadData;

        const currentPayloadHashed = await this.hashProvider.hash(JSON.stringify(currentPayload));

        const idempotencyValue: string | null = await this.idempotencyStore.searchIdempotencyKey(idempotencyKey);

        if (idempotencyValue) {
            const idempotencyPayload: IdempotencyValueSaved = JSON.parse(idempotencyValue);
            if (idempotencyPayload.secretPayload === currentPayloadHashed) {
                const response: TransferServiceResponseDTO = JSON.parse(idempotencyPayload.response);
                return response;
            }

            throw new IdempotencyPayloadConflictError();
        }

        const idempotencyInDB: Transaction | null = await this.transactionRepository.findByIdempotencyKey(idempotencyKey);

        if(idempotencyInDB){
            return idempotencyInDB;
        }

        const transactionToReturn = await this.unitOfWork.execute(async (repositories) => {
            const originAccount = await repositories.account.findById(dto.originAccountId);
            const destinyAccount = await repositories.account.findById(dto.destinyAccountId);

            if(originAccount.currency != destinyAccount.currency){
                throw new CurrencyConflictError();
            }

            if(originAccount.balanceCache < dto.amount){
                throw new InsufficientBalance();
            }

            const transaction = Transaction.create({
                id: randomUUID(),
                type: "TRANSFER",
                amount: dto.amount,
                currency: dto.currency,
                idempotencyKey: dto.idempotencyKey,
                relatedTransactionId: null,
                description: dto.description,
            });

            const ledgerEntryOrigin = LedgerEntry.create({
                id: randomUUID(),
                transactionId: transaction.id,
                accountId: dto.originAccountId,
                direction: "DEBIT",
                amount: dto.amount,
                balanceAfter: originAccount.balanceCache - dto.amount,
            });

            const ledgerEntryDestiny = LedgerEntry.create({
                id: randomUUID(),
                transactionId: transaction.id,
                accountId: dto.destinyAccountId,
                direction: "CREDIT",
                amount: dto.amount,
                balanceAfter: destinyAccount.balanceCache + dto.amount,
            });

            const persistedTransaction = await repositories.transaction.create(transaction);

            const __prismaLedgerEntryOrigin = await repositories.ledgerEntry.create(ledgerEntryOrigin);

            const __prismaLedgerEntryDestiny = await repositories.ledgerEntry.create(ledgerEntryDestiny);

            await repositories.account.updateAmountById(dto.originAccountId, dto.amount, "DEBIT");

            await repositories.account.updateAmountById(dto.destinyAccountId, dto.amount, "CREDIT");

            await repositories.transaction.updateStatusById(persistedTransaction.id, "COMPLETED");
            
            return persistedTransaction;
        })

        const response = Transaction.reconstitute(transactionToReturn);

        const responseStringify = JSON.stringify(response);

        const valueToSaveInCache: IdempotencyValueSaved = {
            secretPayload: JSON.stringify(currentPayload),
            response: responseStringify
        }

        const deletion = await this.idempotencyStore.deleteIdempotencyKey(idempotencyKey);

        if(!deletion && idempotencyValue){
            throw new Error("An error has occured while trying to delete the idempotencyKey in cache");
        }

        await this.idempotencyStore.saveIdempotencyKey(idempotencyKey, valueToSaveInCache);

        return response;
    }
}