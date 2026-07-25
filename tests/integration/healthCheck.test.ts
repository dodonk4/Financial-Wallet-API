import { jest } from '@jest/globals';
import request from "supertest";
import app from "../../src/app";
import { prisma } from '../../src/infrastructure/database/prisma';
import { redisClient } from '../../src/infrastructure/cache/redisClient';

describe("Health endpoints", () => {
  describe("GET /health", () => {
    it("should return 200 and status ok", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        status: "ok",
      });
    });
  });

  describe("GET /health/ready", () => {
    it("should return 200 when all services are available", async () => {
      const response = await request(app).get("/health/ready");

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