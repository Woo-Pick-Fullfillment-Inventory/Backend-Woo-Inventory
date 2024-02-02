import { initializeAdminApp } from "@firebase/rules-unit-testing";
import admin from "firebase-admin";

import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";

export let firestoreClient: FirebaseFirestore.Firestore = process.env["NODE_ENV"] === "production"
  ? admin.firestore()
  : initializeAdminApp({ projectId: "test-project" }).firestore();

export const setfirestoreClient = (client: FirebaseFirestore.Firestore) => {
  firestoreClient = client;
};

export const getUserByAttribute = getUserByAttributeFactory(firestoreClient);
export const insertUser = insertUserFactory(firestoreClient);
