/* eslint-disable */ 
import { MongoClient } from "mongodb";

import {
  MONGO_CONNECT_TIMEOUT,
  statusConnectMongo,
} from "../../constants/mongo.constant.js";

const mongoUri = "mongodb://admin:pass@localhost:27017/test-database?retryWrites=true&writeConcern=majority&authSource=admin";

export class MongoClientSingleton{
  private static instance: MongoClientSingleton | null = null;
  private _mongoClient: MongoClient | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;

  // Private constructor to enforce singleton
  private constructor() {
    this._mongoClient = new MongoClient(mongoUri);
  }

  // Get the singleton instance
  public static getInstance(): MongoClientSingleton {
    if (MongoClientSingleton.instance === null) {
      MongoClientSingleton.instance = new MongoClientSingleton();
    }
    return MongoClientSingleton.instance;
  }

  // Method to connect to MongoDB
  public async connect(): Promise<void> {
    if (this._mongoClient === null) {
      throw new Error("MongoDB client not initialized");
    }

    // Initialize connection timeout logic
    this.connectionTimeout = setTimeout(() => {
      throw new Error("MongoDB connection timeout");
    }, MONGO_CONNECT_TIMEOUT);

    await this._mongoClient.connect();
    console.log("MongoDB connected");

    this.clearConnectionTimeout(); // Clear the timeout once connected
    this.handleEventConnectionMongo(); // Set up event handlers
  }

  // Method to handle MongoDB events
  private handleEventConnectionMongo(): void {
    if (this._mongoClient === null) {
      throw new Error("MongoDB client not initialized");
    }

    this._mongoClient.on(statusConnectMongo.CONNECTED, () => {
      console.log("MongoDB connected");
      this.clearConnectionTimeout();
    });

    this._mongoClient.on(statusConnectMongo.DISCONNECTED, () => {
      console.warn("MongoDB connection disconnected");
      this.handleReconnect();
    });

    this._mongoClient.on(statusConnectMongo.RECONNECT, () => {
      console.log("MongoDB reconnecting");
      this.clearConnectionTimeout();
    });

    this._mongoClient.on(statusConnectMongo.ERROR, (error: any) => {
      console.error("MongoDB error:", error);
      this.handleReconnect();
    });
  }

  // Method to handle reconnections
  private handleReconnect(): void {
    if (this.connectionTimeout === null) {
      this.connectionTimeout = setTimeout(() => {
        throw new Error("MongoDB connection timeout");
      }, MONGO_CONNECT_TIMEOUT);
    }
  }

  // Clear connection timeout
  private clearConnectionTimeout(): void {
    if (this.connectionTimeout !== null) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  // Method to close the MongoDB connection
  public async close(): Promise<void> {
    if (this._mongoClient === null) {
      throw new Error("MongoDB connection failed");
    }

    await this._mongoClient.close();
    this._mongoClient = null; // Set to null after closing
  }

  // Method to retrieve the current MongoDB client
  public get mongoClient(): MongoClient {
    if (!this._mongoClient) {
      throw new Error("MongoDB connection not initialized");
    }
    return this._mongoClient;
  }
}
