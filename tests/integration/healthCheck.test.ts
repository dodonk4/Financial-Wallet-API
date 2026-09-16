import request from "supertest";
import { prisma } from '../../src/infrastructure/database/prisma';
import { redisClient } from '../../src/infrastructure/cache/redisClient';
import { httpServer } from "../compositionRootTest";

describe("Health endpoints", () => {
  describe("GET /health", () => {
    it("should return 200 and status ok", async () => {
      const response = await request(httpServer).get("/health");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        status: "ok",
      });
    });
  });

  describe("GET /health/ready", () => {
    it("should return 200 when all services are available", async () => {
      const response = await request(httpServer).get("/health/ready");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        status: "ready",
      });
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redisClient.quit();
  });

})