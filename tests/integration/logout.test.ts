import request from "supertest";
import { app, prisma } from "../compositionRootTest";
import { redisClient } from "../../src/infrastructure/cache/redisClient";

describe("Logout endpoints", () => {
    it("it should return 200 when a logout is succesful", async () => {

        const response = await request(app).
        post("/auth/logout").
        auth("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MzFjYjg2Mi1iMDY3LTRmZWQtYTRmOS04Mjc5NDBlODNhOWUiLCJuYW1lIjoiSm9obiBEb2UifQ.OHSmnTBRq0z2KkcrXlQavgx0md4GfKgY73TVhMC8SF0", { type: "bearer" });

        expect(response.status).toBe(200);
    });

    it("it should return 404 if the refresh token doesn't exists", async () => {

        const response = await request(app).
        post("/auth/logout").
        auth("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MzFjYjg2Mi1jMDY3LTVmZ2gtYTRmOS04Mjc5NDBlODNhOWUiLCJuYW1lIjoiSm9obiBEb2UifQ.t4oUHdFzTrBwfrJN2bOCyKt9roI5PI0mfkrBJhBsI7U", { type: "bearer" });

        expect(response.status).toBe(404);
    });

    it("it should return 409 if the refresh token has been already revoked", async () => {

        const response = await request(app).
        post("/auth/logout").
        auth("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MzFjYjg2Mi1iMDY3LTRmZWQtYTRmOS04Mjc5NDBlODNhOWUifQ.DOIj5GEQ39wtwDUt8hUd8BBmfAqSaRTj8ZwednatiZc", { type: "bearer" });

        expect(response.status).toBe(409);
    });

    afterAll(async () => {
        await prisma.$disconnect(),
        await redisClient.quit()
    })
})