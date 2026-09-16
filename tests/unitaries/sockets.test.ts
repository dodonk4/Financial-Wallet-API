import { io, Socket } from "socket.io-client";
import { TransferUsecase } from "../../src/application/use-cases/transfers/transfer/TransferUseCase";
import { RedisIdempotencyStore } from "../../src/interfaces/persistence/redis/RedisIdempotencyStore";
import { redisClient } from "../../src/infrastructure/cache/redisClient";
import { SHA256Hasher } from "../../src/infrastructure/security/SHA256Hasher";
import { prisma } from "../compositionRootTest";
import { PrismaTransactionRepository } from "../../src/interfaces/persistence/prisma/repositories/PrismaTransactionRepository";
import { SocketIoNotificationPublisher } from "../../src/interfaces/persistence/socket-io/Socket-ioNotificationPublisher";
import { createServer } from "node:http";
import { TransferServiceRequestDTO } from "../../src/application/use-cases/transfers/transfer/TransferRequestDTO";
import { PrismaTestUnitOfWork } from "../../src/interfaces/persistence/prisma/repositories/PrismaTestUnitOfWork";
import { Transaction } from "../../src/domain/entities/Transaction";

describe("", () => {

    let clientSocket: Socket;
    const httpServer = createServer();
    const hashProvider = new SHA256Hasher();
    const idempotencyStore = new RedisIdempotencyStore(redisClient, hashProvider);
    const unitOfWork = new PrismaTestUnitOfWork(prisma);
    const transactionRepository = new PrismaTransactionRepository(prisma);
    const notificationPublisher = new SocketIoNotificationPublisher(httpServer);
    httpServer.listen(Number(process.env.PORT) || 3000);

    beforeEach(() => {
        clientSocket = io(`http://127.0.0.1:${process.env.PORT || 3000}`);
        clientSocket.connect();
        console.log(clientSocket.connected);
        clientSocket.emit("connection", () => {
            console.log("Client connected");
        })
        clientSocket.on("transaction", (transaction) => {
            console.log("Transaction is: ", transaction);
        })
    });

    it("transaction emit", async () => {

        const transferUseCase = new TransferUsecase(
            idempotencyStore,
            hashProvider,
            unitOfWork,
            transactionRepository,
            notificationPublisher
        );

        const dataToSend: TransferServiceRequestDTO = {
            "originAccountId": "f66e84c4-8ab0-4010-8102-3f1a3fd5eb08",
            "destinyAccountId": "2291d9c5-724f-4c09-a5d2-7dfa8af51f63",
            "amount": 2000,
            "currency": "ARS",
            "description": "Generic description",
            "idempotencyKey": "a6bb77de-9fb5-4a20-b77e-49d2347b791e"
        }

        notificationPublisher.connection("f66e84c4-8ab0-4010-8102-3f1a3fd5eb08");

        const transactionMock = Transaction.create({
            id: "ejemplo",
            type: "TRANSFER",
            amount: 123,
            currency: "ARS",
            idempotencyKey: "safafsaf",
            relatedTransactionId: "assafas",
            description: "safafsa",
        })

        notificationPublisher.emitSuccesfulTransaction(transactionMock);


        await transferUseCase.execute(dataToSend);
    });

    afterEach(() => {
        clientSocket.disconnect();
    })

    afterAll(async () => {
        await prisma.$disconnect();
        await redisClient.quit();
    })
})