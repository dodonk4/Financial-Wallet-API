import request from "supertest";
import { app } from "../../tests/compositionRootTest";
import { prisma } from '../../src/infrastructure/database/prisma';
import { redisClient } from '../../src/infrastructure/cache/redisClient';
// import { randomInt } from "node:crypto";
// import { prismaTestingHelper } from "../../src/infrastructure/persistence/prisma/repositories/PrismaTestUnitOfWork";

describe("Register endpoints", () => {

        it("should return 201 and the user registered", async () => {
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
                    lastName: "Castillo",
                    email: "email.registered@mock.com",
                    password: "abcd1234",
                    document: {
                        type: "DNI",
                        number: 142356213,
                    },
                });

            expect(response.status).toBe(409);

        });

        it("should return 409 if the document number is already registered", async () => {
            const response = await request(app)
                .post("/auth/register").
                send({
                    firstName: "Miguel",
                    lastName: "Castillo",
                    email: "email.not.registered@mock.com",
                    password: "abcd1234",
                    document: {
                        type: "DNI",
                        number: 11111111,
                    },
                });

            expect(response.status).toBe(409);

        });

        //**This commented test is for testing an issue that I see within the library
        //**of transacional-prisma-testing.
        //**It's just to check if a created user does a rollback or not

        // it("peristency check", async () => {
        //     const response = await request(app)
        //         .post("/auth/register").
        //         send({
        //             firstName: "Persistency",
        //             lastName: "Persistency",
        //             email: `${randomInt(8)}@mock.com`,
        //             password: "abcd1234",
        //             document: {
        //                 type: "DNI",
        //                 number: randomInt(8),
        //             },
        //         });
        // });

        //**Pending error test: user is underage

    //**This should be the function called to do the rollback with prismaTestingHelper.
    //**But, apparently, it works fine without it.
    //**More details in src\interfaces\persistence\prisma\repositories\PrismaTestUnitOfWork.ts

    // afterEach(async () => {
    //     prismaTestingHelper?.rollbackCurrentTransaction();
    // })

    afterAll(async () => {
        await prisma.$disconnect();
        await redisClient.quit();
    });
})