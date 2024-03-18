import { Firestore } from "@google-cloud/firestore";
import dotenv from "dotenv";

import { batchWriteProductsFactory } from "./batch-write-products.js";
import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";
import {
  updateUserLastLoginFactory,
  updateUserProductsSyncedFactory,
} from "./update-user.js";
dotenv.config();

if (!process.env["PROJECT_ID"]) {
  throw new Error("PROJECT_ID environment variable is required");
}

if (!process.env["FIRESTORE_PORT"]) {
  throw new Error("FIRESTORE_PORT environment variable is required");
}

export const firestoreClient: FirebaseFirestore.Firestore = process.env["NODE_ENV"] === "production"
  ? new Firestore({ projectId: process.env["PROJECT_ID"] })
  : new Firestore({
    projectId: process.env["PROJECT_ID"],
    host: "127.0.0.1",
    port: parseInt(process.env["FIRESTORE_PORT"]),
    ssl: false,
  });

export const getUserByAttribute = getUserByAttributeFactory(firestoreClient);
export const insertUser = insertUserFactory(firestoreClient);
export const updateUserLastLogin = updateUserLastLoginFactory(firestoreClient);
export const updateUserProductsSynced = updateUserProductsSyncedFactory(firestoreClient);
export const batchWriteProducts = batchWriteProductsFactory(firestoreClient);