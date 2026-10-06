import { Transaction } from "../../../../domain/entities/Transaction";
import { IIdempotencyStore } from "../../../ports/output/IIdempotencyStore";
import { ITokenHasher } from "../../../ports/output/ITokenHasher";
import { TransferServiceRequestDTO } from "./TransferRequestDTO";
import { TransferServiceResponseDTO } from "./TransferResponseDTO";
import { IUnitOfWork } from "../../../ports/output/IUnitOfWork";
import { randomUUID } from "node:crypto";
import { LedgerEntry } from "../../../../domain/entities/LedgerEntry";
import { CurrencyConflictError } from "../../../../domain/errors/domain/CurrencyConflict";
import { ConflictError } from "../../../../domain/errors/http/ConflictError";
import { ITransactionRepository } from "../../../ports/output/ITransactionRepository";
import extractToken from "../../../../interfaces/http/auth/extractToken";
import { ITokenServiceProvider } from "../../../ports/output/ITokenServiceProvider";
import { ForbiddenError } from "../../../../domain/errors/http/ForbiddenError";
import { InsufficientBalance } from "../../../../domain/errors/domain/InsufficientBalance";
import { IEventPublisher } from "../../../ports/output/IEventPublisher";
import { TransactionCompleted } from "../../../../domain/events/TransactionCompleted";

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
        private readonly eventPublisher: IEventPublisher,
        private readonly tokenServiceProvider: ITokenServiceProvider,
    ) { }

    async execute(dto: TransferServiceRequestDTO, authHeader: string): Promise<TransferServiceResponseDTO> {
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

            throw new ConflictError("The idempotency key was already used with a different payload.");
        }

        const idempotencyInDB: Transaction | null = await this.transactionRepository.findByIdempotencyKey(idempotencyKey);

        if (idempotencyInDB) {
            return idempotencyInDB;
        }

        const response = await this.unitOfWork.execute(async (repositories) => {

            const token = extractToken(authHeader);

            const decoded = await this.tokenServiceProvider.decodeToken(token);

            const originAccount = await repositories.account.findById(dto.originAccountId);

            if (originAccount.userId != decoded?.sub) {
                throw new ForbiddenError("The user is not the owner of the origin account");
            }

            const destinyAccount = await repositories.account.findById(dto.destinyAccountId);

            if (originAccount.currency != destinyAccount.currency) {
                throw new CurrencyConflictError();
            }

            if (originAccount.balanceCache < dto.amount) {
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

        const responseStringify = JSON.stringify(response);

        const valueToSaveInCache: IdempotencyValueSaved = {
            secretPayload: JSON.stringify(currentPayload),
            response: responseStringify
        }

        const deletion = await this.idempotencyStore.deleteIdempotencyKey(idempotencyKey);

        if (!deletion && idempotencyValue) {
            throw new Error("An error has occured while trying to delete the idempotencyKey in cache");
        }

        await this.idempotencyStore.saveIdempotencyKey(idempotencyKey, valueToSaveInCache);

        this.eventPublisher.publish(
            new TransactionCompleted(
                response.id,
                dto.originAccountId,
                dto.destinyAccountId,
                dto.amount,
                dto.currency
            )
        )

        return response.getProps;

    }
}