import request from "supertest"
import { httpServer, prisma } from "../compositionRootTest"
import { redisClient } from "../../src/infrastructure/cache/redisClient";
import { SHA256Hasher } from "../../src/infrastructure/security/SHA256Hasher";
import { RedisIdempotencyStore } from "../../src/interfaces/persistence/redis/RedisIdempotencyStore";

describe("Transfers endpoints", () => {
    it("should return 201 and the transaction done", async () => {

        const login = await request(httpServer)
            .post("/auth/login")
            .send({
                email: "correct.user@mock.com",
                password: "abcd1234",
            });

        const response = await request(httpServer)
            .post("/transfers")
            .set("Authorization", `Bearer ${login.body.accessToken}`)
            .send({
                "originAccountId": "2291d9c5-724f-4c09-a5d2-7dfa8af51f63",
                "destinyAccountId": "f66e84c4-8ab0-4010-8102-3f1a3fd5eb08",
                "amount": 2000,
                "currency": "ARS",
                "description": "Generic description",
                "idempotencyKey": "a6bb77de-9fb5-4a20-b77e-49d2347b791e"
            });

        expect(response.status).toBe(201);
    });

    it("should return 403 when a user tries to send a transfer from an account that belongs to another user", async () => {

        const login = await request(httpServer)
            .post("/auth/login")
            .send({
                email: "correct.user@mock.com",
                password: "abcd1234",
            });

        const response = await request(httpServer)
            .post("/transfers")
            .set("Authorization", `Bearer ${login.body.accessToken}`)
            .send({
                "originAccountId": "f66e84c4-8ab0-4010-8102-3f1a3fd5eb08",
                "destinyAccountId": "2291d9c5-724f-4c09-a5d2-7dfa8af51f63",
                "amount": 2000,
                "currency": "ARS",
                "description": "Generic description",
                "idempotencyKey": "a6bb77de-9fb5-4a20-b77e-49d2347b791e"
            });

        expect(response.status).toBe(403);
    });

    it("should return 400 as a zod error when a user tries to send a transfer with the same value in originAccountId and destinyAccountId", async () => {

        const login = await request(httpServer)
            .post("/auth/login")
            .send({
                email: "correct.user@mock.com",
                password: "abcd1234",
            });

        const response = await request(httpServer)
            .post("/transfers")
            .set("Authorization", `Bearer ${login.body.accessToken}`)
            .send({
                "originAccountId": "2291d9c5-724f-4c09-a5d2-7dfa8af51f63",
                "destinyAccountId": "2291d9c5-724f-4c09-a5d2-7dfa8af51f63",
                "amount": 2000,
                "currency": "ARS",
                "description": "Generic description",
                "idempotencyKey": "a6bb77de-9fb5-4a20-b77e-49d2347b791e"
            });

        expect(response.status).toBe(400);
    });

    afterEach(async () => {
        const hasherProvider = new SHA256Hasher();
        const cache = new RedisIdempotencyStore(redisClient, hasherProvider);
        await cache.flushAll();
    })

    afterAll(async () => {
        await prisma.$disconnect();
        await redisClient.quit();
    });
})