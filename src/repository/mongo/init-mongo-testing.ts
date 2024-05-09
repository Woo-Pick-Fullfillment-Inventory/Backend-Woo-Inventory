/* eslint-disable */ 
import { MongoClient } from "mongodb";
import {
  MONGO_CONNECT_TIMEOUT,
  statusConnectMongo,
} from "../../constants/mongo.constant.js";

const mongoUri = "mongodb://admin:pass@localhost:27017/test-database?retryWrites=true&writeConcern=majority&authSource=admin";

let _mongoClient = null as MongoClient | null;

let connectionTimeout: NodeJS.Timeout | null = null;

const clearConnectionTimeout = () => {
  if (connectionTimeout !== null) {
    clearTimeout(connectionTimeout);
    connectionTimeout = null;
  }
};

const handleEventConnectionMongo = ({ connectionMongo }: { connectionMongo: MongoClient }) => {
  connectionMongo.on(statusConnectMongo.CONNECTED, () => {
    console.log("MongoDB connected");
    clearConnectionTimeout();
  });

  connectionMongo.on(statusConnectMongo.DISCONNECTED, () => {
    console.warn("MongoDB connection disconnected");
    handleReconnect();
  });

  connectionMongo.on(statusConnectMongo.RECONNECT, () => {
    console.log("MongoDB reconnecting");
    clearConnectionTimeout();
  });

  connectionMongo.on(statusConnectMongo.ERROR, (error: any) => {
    console.error("MongoDB error:", error);
    handleReconnect();
  });
};

const handleReconnect = () => {
  if (connectionTimeout === null) {
    connectionTimeout = setTimeout(() => {
      throw new Error("MongoDB connection timeout");
    }, MONGO_CONNECT_TIMEOUT);
  }
};

const _initMongo = async () => {
  _mongoClient = await new MongoClient(mongoUri).connect();
  handleEventConnectionMongo({ connectionMongo: _mongoClient });
};

const _closeMongo = async (): Promise<void> => {
  if (_mongoClient === null) {
    throw new Error("MongoDB connection failed");
  }
  await _mongoClient.close();
  _mongoClient = null;
};

export { _initMongo, _closeMongo, _mongoClient };