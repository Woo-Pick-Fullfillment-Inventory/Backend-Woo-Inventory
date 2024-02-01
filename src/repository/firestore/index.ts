import admin from "firebase-admin";
import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";
import { initializeAdminApp } from "@firebase/rules-unit-testing";


export let dbClient: FirebaseFirestore.Firestore = process.env["NODE_ENV"] === "production"
  ? admin.firestore()
  : initializeAdminApp({ projectId: "test-project" }).firestore();

export const setDbClient = (client: FirebaseFirestore.Firestore) => {
  dbClient = client;
};

export const getUserByAttribute = getUserByAttributeFactory(dbClient);
export const insertUser = insertUserFactory(dbClient);
