import { initializeAdminApp } from "@firebase/rules-unit-testing";
import { Firestore } from "@google-cloud/firestore";

import { batchWriteProductsFactory } from "./batch-write-products.js";
import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";
import {
  updateUserLastLoginFactory,
  updateUserProductsSyncedFactory,
} from "./update-user.js";

if (process.env["NODE_ENV"] === "production" && !process.env["PROJECT_ID"]) {
  throw new Error("PROJECT_ID is not defined");
}

console.log(process.env["NODE_ENV"]);

export const firestoreClient: FirebaseFirestore.Firestore = process.env["NODE_ENV"] === "production"
  ? new Firestore({ projectId: process.env["PROJECT_ID"] as string })
  : initializeAdminApp({ projectId: "test-project" }).firestore();

export const getUserByAttribute = getUserByAttributeFactory(firestoreClient);
export const insertUser = insertUserFactory(firestoreClient);
export const updateUserLastLogin = updateUserLastLoginFactory(firestoreClient);
export const updateUserProductsSynced = updateUserProductsSyncedFactory(firestoreClient);
export const batchWriteProducts = batchWriteProductsFactory(firestoreClient);