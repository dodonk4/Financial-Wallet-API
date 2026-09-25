import { httpServer } from "../compositionRootTest";
import request from "supertest"

export const loginForTest = await request(httpServer)
    .post("/auth/login")
    .send({
        email: "correct.user@mock.com",
        password: "abcd1234",
    });