import { Server as httpServer } from "node:http";
import { Server as ioServer } from "socket.io";
import { Transaction } from "../../../domain/entities/Transaction";
import { INotificationPublisher } from "../../../application/ports/output/INotificationPublisher";

export class SocketIoNotificationPublisher implements INotificationPublisher {

    io: ioServer;
    constructor(
        private httpServer: httpServer,
    ) {
        this.io = new ioServer(this.httpServer);
        this.io.on("connection", (socket) => {
            socket.on("createRoom", (userId: string) => {
                const room = `user:${userId}`;

                socket.join(room);

                this.io.to(room).emit("roomCreated");
            });
        });


    }

    disconnectClient(userId: string) {
        this.io.in(`user:${userId}`).disconnectSockets(true);
    }
    emitSuccesfulTransaction(transaction: Transaction, userId: string): void {
        this.io.to(`user:${userId}`).emit("transaction", transaction);
    }


}