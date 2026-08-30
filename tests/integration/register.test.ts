import request from "supertest";
import { app } from "../../tests/compositionRootTest";
import { prisma } from '../../src/infrastructure/database/prisma';
import { redisClient } from '../../src/infrastructure/cache/redisClient';


describe("Register endpoints", () => {


    describe("POST /register", () => {
        it("should return 201 and the usar registered", async () => {
            const response = await request(app)
                .post("/auth/register").
                send({
                    firstName: "Miguel",
                    lastName: "Mock",
                    email: "miguel.mock@mock.com",
                    password: "abcd1234",
                    document: {
                        type: "DNI",
                        number: 142356213,
                    },
                });

            expect(response.status).toBe(201);

        });

        it("should return 400 after failing zod validation", async () => {
            const response = await request(app)
                .post("/auth/register").
                send({
                    firstName: "Miguel",
                    lastName: 1234,
                    email: "miguel.mock@mock.com",
                    password: "abcd1234",
                    document: {
                        type: "DNI",
                        number: 142356213,
                    },
                });

            expect(response.status).toBe(400);

        });

        it("should return 409 if the email is already registered", async () => {
            const response = await request(app)
                .post("/auth/register").
                send({
                    firstName: "Miguel",
                    lastName: 1234,
                    email: "email.registered@mock.com",
                    password: "abcd1234",
                    document: {
                        type: "DNI",
                        number: 142356213,
                    },
                });

            expect(response.status).toBe(409);

        });
    })

    afterAll(async () => {
        await prisma.$disconnect();
        await redisClient.quit();
    });
})