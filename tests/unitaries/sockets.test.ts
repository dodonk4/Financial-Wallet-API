import request from "supertest"
import { io, Socket } from "socket.io-client";
import { redisClient } from "../../src/infrastructure/cache/redisClient";
import { httpServer as walletApiServer, prisma } from "../compositionRootTest";
import { AddressInfo } from "node:net";
import { Transaction } from "../../src/domain/entities/Transaction";
import { RedisIdempotencyStore } from "../../src/interfaces/persistence/redis/RedisIdempotencyStore";
import { SHA256Hasher } from "../../src/infrastructure/security/SHA256Hasher";

describe("Sockets unitary tests", () => {

  let clientSocketWallet: Socket;

  beforeEach(async () => {
    redisClient.flushall();
    await new Promise<void>((resolve) => {
      walletApiServer.listen(
        Number(process.env.PORT) || 3000,
        () => {
          clientSocketWallet = io(
            `http://localhost:${(walletApiServer.address() as AddressInfo).port}`
          );
          clientSocketWallet.on("connect", () => {
            clientSocketWallet.emit("createRoom", "f66e84c4-8ab0-4010-8102-3f1a3fd5eb08");
            clientSocketWallet.once("roomCreated", () => {
              resolve();
            });
          });
        }
      );
    });
  });

  test("Transfer endpoint", async () => {
    const transactionPromise = new Promise<Transaction>((resolve) => {
      clientSocketWallet.once("transaction", (transaction) => {
        resolve(transaction);
      });
    });

    const login = await request(walletApiServer)
      .post("/auth/login")
      .send({
        email: "email.registered@mock.com",
        password: "abcd1234",
      });

    const __response = await request(walletApiServer)
      .post("/transfers")
      .set("Authorization", `Bearer ${login.body.accessToken}`)
      .send({
        originAccountId: "f66e84c4-8ab0-4010-8102-3f1a3fd5eb08",
        destinyAccountId: "2291d9c5-724f-4c09-a5d2-7dfa8af51f63",
        amount: 2000,
        currency: "ARS",
        description: "Generic description",
        idempotencyKey: "a6bb88de-9fb5-4a18-b77e-49d2347b791e"
      });
    
    
    const transaction: any = await transactionPromise;

    expect(transaction.props.props.idempotencyKey).toBe("a6bb88de-9fb5-4a18-b77e-49d2347b791e");

  });

  afterEach(async () => {
    const hasherProvider = new SHA256Hasher();
    const cache = new RedisIdempotencyStore(redisClient, hasherProvider);
    await cache.flushAll();
    
    clientSocketWallet.disconnect();
    walletApiServer.closeAllConnections();
    walletApiServer.close();
  })

  afterAll(async () => {
    await prisma.$disconnect();
    await redisClient.quit();
  })
})
