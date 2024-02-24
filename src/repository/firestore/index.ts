import { initializeAdminApp } from "@firebase/rules-unit-testing";
import { Firestore } from "@google-cloud/firestore";

import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";

export const firestoreClient: FirebaseFirestore.Firestore = process.env["NODE_ENV"] === "production"
  ? new Firestore({
    projectId: process.env["PROJECT_ID"],
    keyFilename: process.env["GOOGLE_APPLICATION_CREDENTIALS"],
  })
  : initializeAdminApp({ projectId: "test-project" }).firestore();

export const getUserByAttribute = getUserByAttributeFactory(firestoreClient);
export const insertUser = insertUserFactory(firestoreClient);
