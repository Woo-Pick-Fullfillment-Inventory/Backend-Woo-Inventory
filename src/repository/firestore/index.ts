import { Firestore } from "@google-cloud/firestore";

import { clearCollectionFactory } from "./collection/clear-collection.js";
import { viewCollectionFactory } from "./collection/view-collection.js";
import {
  ProductFireStoreSchema,
  ProductsFireStoreSchema,
} from "./models/product.type.js";
import { UserFireStoreSchema } from "./models/user.type.js";
import { getUserFactory } from "./users/get-user.js";
import { insertUserFactory } from "./users/insert-user.js";
import { updateUserFactory } from "./users/update-user.js";
import { batchWriteProductsFactory } from "./users-products/batch-write-products.js";
import { getProductsFactory } from "./users-products/get-products.js";
import { insertProductFactory } from "./users-products/insert-product.js";

import type {
  AddProductFireStoreType,
  ProductFireStoreAttributeType
  , ProductFireStoreType,
  ProductsFireStoreType,
} from "./models/product.type.js";
import type {
  UserAttributeType,
  UserFireStoreType,
  UserUpdateAttributeType,
} from "./models/user.type.js";

const firestoreClient: FirebaseFirestore.Firestore = new Firestore({ projectId: process.env["PROJECT_ID"] as string });

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

export {
  UserAttributeType,
  UserUpdateAttributeType,
  UserFireStoreType,
  ProductFireStoreType,
  ProductsFireStoreType,
  ProductFireStoreAttributeType,
  AddProductFireStoreType,
  UserFireStoreSchema,
  ProductFireStoreSchema,
  ProductsFireStoreSchema,
};
