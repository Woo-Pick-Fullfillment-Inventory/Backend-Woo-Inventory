import { MongoClient } from "mongodb";

// todo: add options
const mongoClient = new MongoClient(
  `mongodb://${process.env["MONGO_INITDB_ROOT_USERNAME"]}:${process.env["MONGO_INITDB_ROOT_PASSWORD"]}@${process.env["MONGO_HOST"]}:${process.env["MONGO_PORT"]}/${process.env["MONGO_INITDB_DATABASE"]}?retryWrites=true&writeConcern=majority&authSource=admin`,
  { connectTimeoutMS: 30000 },
);

mongoClient
  .on("error", (err) => console.error("MongoDB Client Error:", err))
  .on("connect", () => console.log("MongoDB Client connecting ..."))
  .on("close", () => console.log("MongoDB Client connection closed."))
  .on("reconnect", () => console.log("MongoDB Client reconnected."))
  .on("timeout", () => console.warn("MongoDB Client connection timeout."))
  .on("disconnected", () => console.warn("MongoDB Client disconnected."))
  .connect()
  .then(() => {
    console.log("MongoDB Client successfully connected!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

export default mongoClient;
