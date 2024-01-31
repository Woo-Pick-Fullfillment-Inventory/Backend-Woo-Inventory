import admin from "firebase-admin";
import { initializeAdminApp } from "@firebase/rules-unit-testing";
import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";

let dbClient: FirebaseFirestore.Firestore;

if (process.env["NODE_ENV"] !== "production") {
  const app = initializeAdminApp({ projectId: "test-project" });
  dbClient = app.firestore();
} else {
  dbClient = admin.firestore();
}
console.log("dbClient", dbClient);
export const getUserByAttribute = getUserByAttributeFactory(dbClient);
export const insertUser = insertUserFactory(dbClient);
