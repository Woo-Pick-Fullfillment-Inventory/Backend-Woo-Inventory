import dotenv from "dotenv";
import {
  MongoClient,
  ServerApiVersion,
} from "mongodb";
dotenv.config();

// todo: add options
const mongoClient =
  process.env["NODE_ENV"] === "production"
    ? new MongoClient(
      `mongodb+srv://woopickcloudvn:${process.env["MONGO_INITDB_ROOT_PASSWORD"]}@cluster0.brctpzh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
      {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        connectTimeoutMS: 30000,
      },
    )
    : new MongoClient(
      "mongodb://admin:pass@localhost:27017?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false",
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
