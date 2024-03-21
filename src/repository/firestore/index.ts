import { Firestore } from "@google-cloud/firestore";
import dotenv from "dotenv";

import { batchWriteProductsFactory } from "./batch-write-products.js";
import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";
import {
  updateUserLastLoginFactory,
  updateUserProductsSyncedFactory,
} from "./update-user.js";
import { viewCollectionFactory } from "./view-collection.js";
dotenv.config();

if (!process.env["PROJECT_ID"]) {
  throw new Error("PROJECT_ID environment variable is required");
}

export const firestoreClient: FirebaseFirestore.Firestore = new Firestore({ projectId: process.env["PROJECT_ID"] });

export const getUserByAttribute = getUserByAttributeFactory(firestoreClient);
export const insertUser = insertUserFactory(firestoreClient);
export const updateUserLastLogin = updateUserLastLoginFactory(firestoreClient);
export const updateUserProductsSynced = updateUserProductsSyncedFactory(firestoreClient);
export const batchWriteProducts = batchWriteProductsFactory(firestoreClient);
export const viewCollection = viewCollectionFactory(firestoreClient);