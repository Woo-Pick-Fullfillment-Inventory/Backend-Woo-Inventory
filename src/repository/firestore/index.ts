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

const projectId = process.env["PROJECT_ID"] || "test-project";
const firestorePort = process.env["NODE_ENV"] || "8888";

export const firestoreClient: FirebaseFirestore.Firestore = process.env["NODE_ENV"] === "production"
  ? new Firestore({ projectId: process.env["PROJECT_ID"] as string })
  : new Firestore({
    projectId: projectId,
    host: "127.0.0.1",
    port: parseInt(firestorePort),
    ssl: false,
  });

export const getUserByAttribute = getUserByAttributeFactory(firestoreClient);
export const insertUser = insertUserFactory(firestoreClient);
export const updateUserLastLogin = updateUserLastLoginFactory(firestoreClient);
export const updateUserProductsSynced = updateUserProductsSyncedFactory(firestoreClient);
export const batchWriteProducts = batchWriteProductsFactory(firestoreClient);