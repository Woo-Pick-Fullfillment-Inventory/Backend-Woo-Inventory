import { MongoClient } from "mongodb";

const mongoUri =
  "mongodb://admin:pass@localhost:27017/test-database?retryWrites=true&writeConcern=majority&authSource=admin";

// todo: add options
const mongoClient = new MongoClient(mongoUri, { connectTimeoutMS: 30000 });

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