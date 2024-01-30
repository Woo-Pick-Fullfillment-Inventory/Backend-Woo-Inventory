import admin from "firebase-admin";

import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";

let db: FirebaseFirestore.Firestore;

if (process.env["NODE_ENV"] !== "test") {
  db = admin.firestore();
}

export const getDb = () => {
  return db;
};

export const setDbEmulator = (database: FirebaseFirestore.Firestore) => {
  db = database;
};

export const getUserByAttribute = getUserByAttributeFactory(getDb());
export const insertUser = insertUserFactory(getDb());