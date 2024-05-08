import { MongoClient } from "mongodb";

const username = process.env["MONGO_INITDB_ROOT_USERNAME"] || "admin";
const password = process.env["MONGO_INITDB_ROOT_PASSWORD"] || "password";
const host = process.env["MONGO_HOST"] || "mongo";
const port = process.env["MONGO_PORT"] || "27017";
const database = process.env["MONGO_INITDB_DATABASE"] || "test-database";

// todo: add options
const mongoClient = new MongoClient(
  `mongodb://${username}:${password}@${host}:${port}/${database}?retryWrites=true&writeConcern=majority&authSource=admin`,
  { connectTimeoutMS: 30000 },
);

mongoClient
  .on("error", (err) => console.error("MongoDB Client Error:", err))
  .on("connect", () => console.log("MongoDB Client connecting ..."))
  .on("close", () => console.log("MongoDB Client connection closed."))
  .on("reconnect", () => console.log("MongoDB Client reconnected."))
  .on("timeout", () => console.warn("MongoDB Client connection timeout."))
  .on("disconnected", () => console.warn("MongoDB Client disconnected."))
  .connect();

export default mongoClient;
