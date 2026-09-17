import { io, Socket } from "socket.io-client";
import { TransferUsecase } from "../../src/application/use-cases/transfers/transfer/TransferUseCase";
import { RedisIdempotencyStore } from "../../src/interfaces/persistence/redis/RedisIdempotencyStore";
import { redisClient } from "../../src/infrastructure/cache/redisClient";
import { SHA256Hasher } from "../../src/infrastructure/security/SHA256Hasher";
import { prisma } from "../compositionRootTest";
import { PrismaTransactionRepository } from "../../src/interfaces/persistence/prisma/repositories/PrismaTransactionRepository";
import { SocketIoNotificationPublisher } from "../../src/interfaces/persistence/socket-io/Socket-ioNotificationPublisher";
import { createServer } from "node:http";
import { PrismaTestUnitOfWork } from "../../src/interfaces/persistence/prisma/repositories/PrismaTestUnitOfWork";
import { Transaction } from "../../src/domain/entities/Transaction";
import { AddressInfo } from "node:net";
import { INotificationPublisher } from "../../src/application/ports/output/INotificationPublisher";

describe("", () => {

  let clientSocket: Socket;
  let clientSocket2: Socket;

  const hashProvider = new SHA256Hasher();
  const idempotencyStore = new RedisIdempotencyStore(redisClient, hashProvider);
  const unitOfWork = new PrismaTestUnitOfWork(prisma);
  const transactionRepository = new PrismaTransactionRepository(prisma);
  let notificationPublisher: INotificationPublisher;
  // console.log(httpServer.address());

  beforeAll((done) => {
    const httpServer = createServer();
    notificationPublisher = new SocketIoNotificationPublisher(httpServer, "f66e84c4-8ab0-4010-8102-3f1a3fd5eb08");
    // notificationPublisher.connection("f66e84c4-8ab0-4010-8102-3f1a3fd5eb08");

    httpServer.listen(Number(process.env.PORT) || 3000, () => {
      clientSocket = io(`http://localhost:${(httpServer.address() as AddressInfo).port}`);
      clientSocket2 = io(`http://localhost:${(httpServer.address() as AddressInfo).port}`);
      // io.on("connection", (socket: any) => {
      //   serverSocket = socket;
      // });
      //Esto lo hace directamente el notificationPublisher cuando se instancia
      // console.log("Conectado");

      clientSocket.on("connect", done);

    });

  });



  test("should work", (done) => {

    const transactionMock = Transaction.create({
      id: "ejemplo",
      type: "TRANSFER",
      amount: 123,
      currency: "ARS",
      idempotencyKey: "safafsaf",
      relatedTransactionId: "assafas",
      description: "safafsa",
    });

    clientSocket.on("transaction", (transaction) => {
      console.log(transaction);
      done();
    });

    notificationPublisher.emitSuccesfulTransaction(transactionMock);

  });

  // it("transaction emit", async () => {

  //   const transactionMock = Transaction.create({
  //     id: "ejemplo",
  //     type: "TRANSFER",
  //     amount: 123,
  //     currency: "ARS",
  //     idempotencyKey: "safafsaf",
  //     relatedTransactionId: "assafas",
  //     description: "safafsa",
  //   })


  //   // clientSocket.on("hello", () => {
  //   //   console.log("hello server");
  //   // });

  //   clientSocket.on("transaction", (algo: string) => {
  //     console.log("Transaction is: ", algo);
  //   })
  //   notificationPublisher.emitSuccesfulTransaction(transactionMock);


  //   // await transferUseCase.execute(dataToSend);
  // });

  afterAll(async () => {
    await prisma.$disconnect();
    await redisClient.quit();
    clientSocket.disconnect();
  })
})

// import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
// import { Server, type Socket as ServerSocket } from "socket.io";
// import { INotificationPublisher } from "../../src/application/ports/output/INotificationPublisher";

// function waitFor(socket: ServerSocket | ClientSocket, event: string) {
//   return new Promise((resolve) => {
//     socket.once(event, resolve);
//   });
// }

// describe("my awesome project", () => {
//   let io: any, serverSocket: ServerSocket, clientSocket: ClientSocket;

//   beforeAll((done) => {
//     const httpServer = createServer();
//     io = new Server(httpServer);
//     httpServer.listen(() => {
//       const port = (httpServer.address() as AddressInfo).port;
//       clientSocket = ioc(`http://localhost:${port}`);
//       io.on("connection", (socket: any) => {
//         serverSocket = socket;
//       });
//       clientSocket.on("connect", done);
//     });
//   });

//   afterAll(() => {
//     io.close();
//     clientSocket.disconnect();
//   });

//   test("should work", (done) => {
//     clientSocket.on("hello", (arg) => {
//       expect(arg).toBe("world");
//       done();
//     });
//     serverSocket.emit("hello", "world");
//   });

//   test("should work with an acknowledgement", (done) => {
//     serverSocket.on("hi", (cb) => {
//       cb("hola");
//     });
//     clientSocket.emit("hi", (arg: any) => {
//       expect(arg).toBe("hola");
//       done();
//     });
//   });

//   test("should work with emitWithAck()", async () => {
//     serverSocket.on("foo", (cb) => {
//       cb("bar");
//     });
//     const result = await clientSocket.emitWithAck("foo");
//     expect(result).toBe("bar");
//   });

//   test("should work with waitFor()", () => {
//     clientSocket.emit("baz");

//     return waitFor(serverSocket, "baz");
//   });
// });