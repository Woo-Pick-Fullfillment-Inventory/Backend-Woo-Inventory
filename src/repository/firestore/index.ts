import { Firestore } from "@google-cloud/firestore";
import dotenv from "dotenv";

import { clearCollectionFactory } from "./collection/clear-collection.js";
import { viewCollectionFactory } from "./collection/view-collection.js";
import { getUserFactory } from "./users/get-user.js";
import { insertUserFactory } from "./users/insert-user.js";
import { updateUserFactory } from "./users/update-user.js";
import { batchWriteProductsFactory } from "./users-products/batch-write-products.js";
import { getProductsFactory } from "./users-products/get-products.js";
import { insertProductFactory } from "./users-products/insert-product.js";
dotenv.config();

if (!process.env["PROJECT_ID"]) {
  throw new Error("PROJECT_ID environment variable is required");
}

const firestoreClient: FirebaseFirestore.Firestore = new Firestore({ projectId: process.env["PROJECT_ID"] });

export const firestoreRepository = {
  user: {
    getUserByUsername: getUserFactory(firestoreClient)("username"),
    getUserByEmail: getUserFactory(firestoreClient)("email"),
    getUserById: getUserFactory(firestoreClient)("user_id"),
    insertUser: insertUserFactory(firestoreClient),
    updateUserLastLogin: updateUserFactory(firestoreClient)("last_login"),
    updateUserProductsSynced: updateUserFactory(firestoreClient)("are_products_synced"),
  },
  product: {
    batchWriteProducts: batchWriteProductsFactory(firestoreClient),
    getProducts: getProductsFactory(firestoreClient),
    insertProduct: insertProductFactory(firestoreClient),
  },
  collection: {
    viewCollection: viewCollectionFactory(firestoreClient),
    clearCollection: clearCollectionFactory(firestoreClient),
  },
};