import { IIdempotencyStore } from "../../../ports/output/IIdempotencyStore";
import { ITransactionRepository } from "../../../ports/output/ITransactionRepository";
import { TransferServiceRequestDTO } from "./TransferServiceRequestDTO";
import { TransferServiceResponseDTO } from "./TransferServiceResponseDTO";

export class TransferService{
    constructor(
        private readonly transactionRepository: ITransactionRepository,
        private readonly idempotencyStore: IIdempotencyStore
    ){ }

    async execute(dto: TransferServiceRequestDTO): Promise<TransferServiceResponseDTO>{
        //The idempotency search can be outside the UnitOfWork
        const idempotencyKeyExist = await this.idempotencyStore.searchIdempotencyKey(dto.idempotencyKey);

        if(idempotencyKeyExist){

        }
    }
}