import { Firestore } from "@google-cloud/firestore";

import { batchWriteProductsFactory } from "./batch-write-products.js";
import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";
import {
  updateUserLastLoginFactory,
  updateUserProductsSyncedFactory,
} from "./update-user.js";

if (!process.env["PROJECT_ID"]) {
  throw new Error("PROJECT_ID is not defined");
}

if (!process.env["FIRESTORE_PORT"]) {
  throw new Error("FIRESTORE_PORT is not defined");
}

export const firestoreClient: FirebaseFirestore.Firestore = process.env["NODE_ENV"] === "production"
  ? new Firestore({ projectId: process.env["PROJECT_ID"] as string })
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