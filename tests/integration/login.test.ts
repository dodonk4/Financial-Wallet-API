import request from "supertest";
import { redisClient } from "../../src/infrastructure/cache/redisClient";
import { app, prisma } from "../compositionRootTest";

describe("Login endpoints", () => {
    it("should return 201 when the user is logged", async () => {
        const response = await request(app).
        post("/auth/login").
        send({
            email: "email.registered@mock.com",
            password: "abcd1234",
        });

        expect(response.status).toBe(201);
    });

    it("should return 400 after failing zod validation", async () => {
        const response = await request(app).
        post("/auth/login").
        send({
            email: "email.registered@mock.com",
            password: 234,
        });

        expect(response.status).toBe(400);
    });

    it("should return 401 after entering invalid credentials", async () => {
        const response = await request(app).
        post("/auth/login").
        send({
            email: "email.registered@mock.com",
            password: "1234abcd",
        });

        expect(response.status).toBe(401);
    });

    //Pending error tests:
    //  Suspended user
    //  Rate limit excedeed

    afterAll(async () => {
        await prisma.$disconnect();
        await redisClient.quit();
    });
})