import Redis from "ioredis";

export const redisClient = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: 3,
});

redisClient.on("connect", () => {
  console.log("🟢 Redis conectado");
});

redisClient.on("error", (error) => {
  console.error("🔴 Error de Redis:", error);
});