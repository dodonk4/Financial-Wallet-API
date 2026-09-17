import { Server as httpServer } from "node:http";
import { Server as ioServer } from "socket.io";
import { Transaction } from "../../../domain/entities/Transaction";
import { INotificationPublisher } from "../../../application/ports/output/INotificationPublisher";

export class SocketIoNotificationPublisher implements INotificationPublisher {

    io: ioServer;
    room: string | undefined;
    constructor(private httpServer: httpServer, private userId: string) {
        this.io = new ioServer(this.httpServer);
        this.io.on("connection", (socket) => {
            // this.room = `user:${this.userId}`
            // socket.join(this.room);
            // this.io.to(this.room).emit("hello");
            // console.log("This room was established as: ", this.room);
            console.log("Socket connected: Id: ", socket.id);
        });
        this.io.emit("hello");
    }


    // connection(userId: string): void {
    //     // this.io.on("connection", (socket) => {
    //     //     this.room = `user:${userId}`
    //     //     socket.join(this.room);
    //     //     console.log("This room was established as: ", this.room);
    //     //     console.log("Socket connected: Id: ", socket.id);
    //     // })
    // }

    emitSuccesfulTransaction(transaction: Transaction): void {
        this.io.emit("transaction", transaction);


    }


}