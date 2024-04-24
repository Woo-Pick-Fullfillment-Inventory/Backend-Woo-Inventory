import { createClient } from "redis";

const redisClient = createClient({ url: "redis://localhost:6379" });

redisClient
  .on("error", (err) => console.error("Redis Client Error:", err))
  .on("connect", () => console.log("Redis Client connecting ..."))
  .on("ready", () => console.log("Redis Client connected!"))
  .connect();

export default redisClient;