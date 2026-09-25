import request from "supertest";
import { httpServer, prisma } from "../../compositionRootTest";
import { loginForTest } from "../../utils/login";
import { redisClient } from "../../../src/infrastructure/cache/redisClient";

describe("Check account balance endpoints", () => {
    it("it should return 200 when a user asks to see the balanceCache of one of its accounts", async () => {
        const response = await request(httpServer).
            get(`/accounts/2291d9c5-724f-4c09-a5d2-7dfa8af51f63/balance`).
            set("Authorization", `Bearer ${loginForTest.body.accessToken}`);


        expect(response.status).toBe(200);
    });

    it("it should return 403 when a user asks to see the balanceCache of an account that isn't his", async () => {
        const response = await request(httpServer).
            get(`/accounts/f66e84c4-8ab0-4010-8102-3f1a3fd5eb08/balance`).
            set("Authorization", `Bearer ${loginForTest.body.accessToken}`);


        expect(response.status).toBe(403);
    });

    it("it should return 404 when a user asks to see the balanceCache of an account that doesn't exist", async () => {
        const response = await request(httpServer).
            get(`/accounts/b55e84c4-8ab0-5010-8102-3f1a3fd5eb08/balance`).
            set("Authorization", `Bearer ${loginForTest.body.accessToken}`);


        expect(response.status).toBe(404);
    });


    afterAll(async () => {
        await prisma.$disconnect();
        await redisClient.quit();
    });
})