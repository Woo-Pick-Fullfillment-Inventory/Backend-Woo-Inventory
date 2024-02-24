import { initializeAdminApp } from "@firebase/rules-unit-testing";
import { Firestore } from "@google-cloud/firestore";

import { getUserByAttributeFactory } from "./get-user.js";
import { insertUserFactory } from "./insert-user.js";
import logger from "../../modules/create-logger.js";

export const firestoreClient: FirebaseFirestore.Firestore = process.env["NODE_ENV"] === "production"
  ? new Firestore({ projectId: process.env["PROJECT_ID"] })
  : initializeAdminApp({ projectId: "test-project" }).firestore();

logger.info("Firestore client initialized ", firestoreClient);

export const getUserByAttribute = getUserByAttributeFactory(firestoreClient);
export const insertUser = insertUserFactory(firestoreClient);
