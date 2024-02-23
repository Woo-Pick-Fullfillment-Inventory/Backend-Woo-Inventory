import { initializeAdminApp } from "@firebase/rules-unit-testing";
import admin from "firebase-admin";

import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";

export const firestoreClient: FirebaseFirestore.Firestore = process.env["NODE_ENV"] === "production"
  ? admin.firestore()
  : initializeAdminApp({ projectId: "test-project" }).firestore();

export const getUserByAttribute = getUserByAttributeFactory(firestoreClient);
export const insertUser = insertUserFactory(firestoreClient);
