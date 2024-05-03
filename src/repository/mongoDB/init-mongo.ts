import { MongoClient } from "mongodb";

const mongoUri =
  "mongodb://admin:pass@localhost:27017/test-database?retryWrites=true&writeConcern=majority&authSource=admin";

const mongoClient = new MongoClient(mongoUri);

mongoClient
  .on("error", (err) => console.error("MongoDB Client Error:", err))
  .on("connect", () => console.log("MongoDB Client connecting ..."))
  .on("open", () => console.log("MongoDB Client connected!"))
  .on("close", () => console.log("MongoDB Client connection closed."))
  .on("reconnect", () => console.log("MongoDB Client reconnected."))
  .on("timeout", () => console.warn("MongoDB Client connection timeout."))
  .on("disconnect", () => console.warn("MongoDB Client disconnected."));

export default mongoClient;
