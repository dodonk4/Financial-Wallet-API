import { LoginResponseDTO } from "../../src/application/use-cases/auth/login/LoginResponseDTO";
import { redisClient } from "../../src/infrastructure/cache/redisClient";
import { app as appNonPersistent, prisma } from "../compositionRootTest";
import { app as appPersistent } from "../../src/compositionRoot"
import request from "supertest";
import { setTimeout } from 'node:timers/promises';
import { SHA256Hasher } from "../../src/infrastructure/security/SHA256Hasher";


describe("Refresh token endpoints", () => {
    it("should return 201 after succesfuly refreshing tokens", async () => {

        const loggedUser = await request(appPersistent).post("/auth/login").send({
            email: "correct.user@mock.com",
            password: "abcd1234",
        });

        const loggedUserReturn: LoginResponseDTO = loggedUser.body;

        const hasher = new SHA256Hasher();

        const tokenHash = hasher.hash(loggedUserReturn.refreshToken);

        // console.log("Este es el tokenHash del usuario logueado", tokenHash);

        await setTimeout(2000);
        //If the setTimeout is not present, the tokenHash wil be equal when tryin to refresh and wil throw an error
        //because there's an unique value repeated

        const response = await request(appNonPersistent).
        post("/auth/refresh").
        auth(loggedUserReturn.refreshToken, { type: "bearer" });

        expect(response.status).toBe(201);
    })

    afterAll(async () => {
        await prisma.$disconnect();
        await redisClient.quit();
    })
})