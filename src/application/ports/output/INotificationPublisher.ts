import { Transaction } from "../../../domain/entities/Transaction";

export interface INotificationPublisher {
    disconnectClient(userId: string): void
    emitSuccesfulTransaction(transaction: Transaction, userId: string): void

}