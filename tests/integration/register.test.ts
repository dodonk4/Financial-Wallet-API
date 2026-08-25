import request from "supertest";
import app from "../../src/app";
import { prisma } from '../../src/infrastructure/database/prisma';
import { redisClient } from '../../src/infrastructure/cache/redisClient';

describe("Register endpoints", () => {
    describe("POST /register", () => {
        it("should return 201 and the usar registered", async () => {
            // const response = await request(app)
            await request(app)
                .post("/auth/register").
                send({
                    firstName: "Miguel",
                    lastName: "Mock",
                    email: "miguel.mock@mock.com",
                    password: "abcd1234",
                    document: {
                        type: "DNI",
                        number: "142356213",
                    },
                }).
                expect(201);
        })
    })

    afterAll(async () => {
        await prisma.$disconnect();
        await redisClient.quit();
    });
})