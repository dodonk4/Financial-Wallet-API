import request from "supertest"
import { httpServer } from "../../compositionRootTest"
import { loginForTest } from "../../utils/login"

describe("Create additional account endpoints", () => {
    it("should return 201 when an additional account is created", async () => {
        const response = await request(httpServer).
        post("/accounts/create").
        set("Authorization", `Bearer ${loginForTest.body.accessToken}`).
        send({
            currency: "USD",
        });

        expect(response.status).toBe(201);
    })

    it("should return 409 when the user already has an account with the requested currency", async () => {
        const response = await request(httpServer).
        post("/accounts/create").
        set("Authorization", `Bearer ${loginForTest.body.accessToken}`).
        send({
            currency: "ARS",
        });

        expect(response.status).toBe(409);
    })

    //Correct when applying zod errors
    it("should return 400 when the requested currency is not supported", async () => {
        const response = await request(httpServer).
        post("/accounts/create").
        set("Authorization", `Bearer ${loginForTest.body.accessToken}`).
        send({
            currency: "CNY",
        });

        expect(response.status).toBe(422);
    })
})