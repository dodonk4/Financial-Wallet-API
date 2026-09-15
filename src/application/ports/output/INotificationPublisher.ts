import { Transaction } from "../../../domain/entities/Transaction";

export interface INotificationPublisher {

    connection(userId: string): void

    emitSuccesfulTransaction(transaction: Transaction): void

}