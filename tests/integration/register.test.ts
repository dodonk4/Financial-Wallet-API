import request from "supertest";
import { app } from "../../src/compositionRoot";
import { prisma } from '../../src/infrastructure/database/prisma';
import { redisClient } from '../../src/infrastructure/cache/redisClient';
import { PrismaClient } from "../../generated/prisma/internal/class";
import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';

// Cache for the PrismaTestingHelper. Only one PrismaTestingHelper should be instantiated per test runner (i.e. only one if your tests run sequentially).
let prismaTestingHelper: PrismaTestingHelper<PrismaClient> | undefined;
// Saves the PrismaService that will be used during test cases. Will always execute queries on the currently active transaction.
let prismaService: PrismaClient;

describe("Register endpoints", () => {

    beforeEach(async () => {
        if (prismaTestingHelper == null) {
            // Initialize testing helper if it has not been initialized before
            // const originalPrismaService = new PrismaService(); // in newer prisma versions, you may have to pass an adapter here
            // Seed your database / Create source database state that will be used in each test case (if needed)
            // ...
            prismaTestingHelper = new PrismaTestingHelper(prisma);
            // Save prismaService. All calls to this prismaService will be routed to the currently active transaction
            prismaService = prismaTestingHelper.getProxyClient();
        }

        await prismaTestingHelper.startNewTransaction();
    });

    describe("POST /register", () => {
        it("should return 201 and the usar registered", async () => {
            // const response = await request(app)
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

            const userId = response.body.user.id;
            const accountId = response.body.account.id;

            await prisma.account.delete({ where: { id: accountId } });
            await prisma.user.delete({ where: { id: userId } });
        });
    })

    afterEach(async () => {
        prismaTestingHelper?.rollbackCurrentTransaction();
    })

    afterAll(async () => {
        await prisma.$disconnect();
        await redisClient.quit();
    });
})