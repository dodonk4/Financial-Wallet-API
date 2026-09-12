import request from "supertest"
import { app, prisma } from "../compositionRootTest"
import { redisClient } from "../../src/infrastructure/cache/redisClient";

describe("Transfers endpoints", () => {
    it("should return 201 and the transaction done", async () => {
        const response = await request(app)
            .post("/transfers")
            .send({
                "originAccountId": "f66e84c4-8ab0-4010-8102-3f1a3fd5eb08",
                "destinyAccountId": "2291d9c5-724f-4c09-a5d2-7dfa8af51f63",
                "amount": 2000,
                "currency": "ARS",
                "description": "Generic description",
                "idempotencyKey": "a6bb77de-9fb5-4a20-b77e-49d2347b791e"
            });

        expect(response.status).toBe(201);
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await redisClient.quit();
    });
})