import { Server as httpServer } from "node:http";
import { Server as ioServer } from "socket.io";
import { Transaction } from "../../../domain/entities/Transaction";
import { INotificationPublisher } from "../../../application/ports/output/INotificationPublisher";

export class SocketIoNotificationPublisher implements INotificationPublisher {

    io: ioServer;
    constructor(private httpServer: httpServer) {
        this.io = new ioServer(this.httpServer);
    }


    connection(userId: string): void {
        this.io.on("connection", (socket) => {
            socket.join(`user:${userId}`);
            console.log("Socket connected: Id: ", socket.id);
        })
    }

    emitSuccesfulTransaction(transaction: Transaction): void {
        this.io.emit("transaction", transaction);
    }

}