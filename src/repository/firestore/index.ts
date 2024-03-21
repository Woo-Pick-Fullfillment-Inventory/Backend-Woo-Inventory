import { initializeAdminApp } from "@firebase/rules-unit-testing";
import { Firestore } from "@google-cloud/firestore";

import { insertProductFactory } from "./add-product-firestore.js";
import { batchWriteProductsFactory } from "./batch-write-products.js";
import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";
import {
  updateUserLastLoginFactory,
  updateUserProductsSyncedFactory,
} from "./update-user.js";

export const firestoreClient: FirebaseFirestore.Firestore = process.env["NODE_ENV"] === "production"
  ? new Firestore({ projectId: process.env["PROJECT_ID"] })
  : initializeAdminApp({ projectId: "test-project" }).firestore();

export const getUserByAttribute = getUserByAttributeFactory(firestoreClient);
export const insertUser = insertUserFactory(firestoreClient);
export const updateUserLastLogin = updateUserLastLoginFactory(firestoreClient);
export const updateUserProductsSynced = updateUserProductsSyncedFactory(firestoreClient);
export const batchWriteProducts = batchWriteProductsFactory(firestoreClient);
export const insertProduct = insertProductFactory(firestoreClient);
