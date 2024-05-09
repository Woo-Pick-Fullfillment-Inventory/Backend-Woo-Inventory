import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();
// todo: add options
let mongoClient: MongoClient | null = null;

if (process.env["NODE_ENV"] === "production") {
  mongoClient = new MongoClient(
    process.env["MONGO_URI"] as string,
    { connectTimeoutMS: 30000 },
  );
}

if (process.env["NODE_ENV"] === "development") {
  mongoClient = new MongoClient(
    "mongodb://admin:pass@localhost:27017/test-database?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false",
    { connectTimeoutMS: 30000 },
  );
}

if (process.env["NODE_ENV"] === "test") {
  mongoClient = new MongoClient(
    "mongodb://admin:pass@0.0.0.0:27017/test-database?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false",
    { connectTimeoutMS: 30000 },
  );
}

if (!mongoClient) {
  throw new Error("MongoDB Client is not defined.");
}

mongoClient
  .on("error", (err) => console.error("MongoDB Client Error:", err))
  .on("connect", () => console.log("MongoDB Client connecting ..."))
  .on("close", () => console.log("MongoDB Client connection closed."))
  .on("reconnect", () => console.log("MongoDB Client reconnected."))
  .on("timeout", () => console.warn("MongoDB Client connection timeout."))
  .on("disconnected", () => console.warn("MongoDB Client disconnected."))
  .connect();

// eslint-disable-next-line
export default mongoClient!;
