import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.REDIS_CLIENT_URI as string, {
  password: process.env.REDIS_PASSWORD as string,
  maxRetriesPerRequest: 5,
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

redis.on("connect", () => {
  console.log("Redis connected");
});

export default redis;