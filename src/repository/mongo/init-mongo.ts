import { MongoClient } from "mongodb";
// todo: add options
const mongoClient = process.env["NODE_ENV"] !== "production" ? new MongoClient(
  "mongodb://admin:pass@localhost:27017/test-database?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false",
  { connectTimeoutMS: 30000 },
) : new MongoClient(
  `mongodb://${process.env["MONGO_USER"]}:${process.env["MONGO_PASSWORD"]}@${process.env["MONGO_CLUSTER"]}/${process.env["MONGO_DB"]}?retryWrites=true&w=majority`,
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
