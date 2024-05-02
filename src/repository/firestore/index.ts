import { Firestore } from "@google-cloud/firestore";

import { batchWriteProductsCategoriesFactory } from "./categories/batch-write-categories.js";
import { getProductsCategoriesFactory } from "./categories/get-categories.js";
import { clearCollectionFactory } from "./collection/clear-collection.js";
import { viewCollectionFactory } from "./collection/view-collection.js";
import {
  ProductsCategoriesFirestoreSchema,
  ProductsCategoryFirestoreSchema,
} from "./models/category.type.js";
import {
  OrderFirestoreInputSchema,
  OrderFirestoreSchema,
  OrdersFirestoreInputSchema,
  OrdersFirestoreSchema,
} from "./models/order.type.js";
import {
  ProductFireStoreSchema,
  ProductsFireStoreSchema,
} from "./models/product.type.js";
import { UserFireStoreSchema } from "./models/user.type.js";
import { batchWriteOrdersFactory } from "./orders/batch-write-orders.js";
import { batchWriteProductsFactory } from "./products/batch-write-products.js";
import {
  type ProductsFireStorePaginationType,
  getProductsFactory,
} from "./products/get-products.js";
import { insertProductFactory } from "./products/insert-product.js";
import { getUserFactory } from "./users/get-user.js";
import { insertUserFactory } from "./users/insert-user.js";
import { updateUserFactory } from "./users/update-user.js";

import type {
  ProductCategoriesFirestoreInputType,
  ProductsCategoriesFireStoreClientType,
  ProductsCategoriesFirestoreType,
  ProductsCategoryFireStoreClientType,
  ProductsCategoryFirestoreType,
} from "./models/category.type.js";
import type {
  OrderFirestoreInputType,
  OrderFirestoreType,
  OrdersFirestoreInputType,
  OrdersFirestoreType,
} from "./models/order.type.js";
import type {
  AddProductFireStoreType,
  ProductFireStoreAttributeType,
  ProductFireStoreType,
  ProductFirestoreInputType,
  ProductsFireStoreType,
  ProductsFirestoreInputType,
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
    updateUserProductsSynced: updateUserFactory(firestoreClient)(
      "sync.are_products_synced",
    ),
    updateUserProductsCategoriesSynced: updateUserFactory(firestoreClient)(
      "sync.are_products_categories_synced",
    ),
    updateUserOrdersSynced: updateUserFactory(firestoreClient)(
      "sync.are_orders_synced",
    ),
  },
  product: {
    batchWriteProducts: batchWriteProductsFactory(firestoreClient),
    getProducts: getProductsFactory(firestoreClient),
    insertProduct: insertProductFactory(firestoreClient),
  },
  productCategory: {
    batchWriteProductsCategories:
      batchWriteProductsCategoriesFactory(firestoreClient),
    getProductsCategories: getProductsCategoriesFactory(firestoreClient),
  },
  order: { batchWriteOrders: batchWriteOrdersFactory(firestoreClient) },
  collection: {
    viewCollection: viewCollectionFactory(firestoreClient),
    clearCollection: clearCollectionFactory(firestoreClient),
  },
};

export {
  UserFireStoreSchema,
  ProductFireStoreSchema,
  ProductsFireStoreSchema,
  ProductsCategoriesFirestoreSchema,
  ProductsCategoryFirestoreSchema,
  OrderFirestoreInputSchema,
  OrdersFirestoreInputSchema,
  OrderFirestoreSchema,
  OrdersFirestoreSchema,
  UserAttributeType,
  UserUpdateAttributeType,
  UserFireStoreType,
  ProductFireStoreType,
  ProductsFireStoreType,
  ProductFireStoreAttributeType,
  AddProductFireStoreType,
  ProductsCategoryFirestoreType,
  ProductsCategoriesFirestoreType,
  ProductsCategoryFireStoreClientType,
  ProductsCategoriesFireStoreClientType,
  ProductsFireStorePaginationType,
  ProductFirestoreInputType,
  ProductsFirestoreInputType,
  OrdersFirestoreInputType,
  OrderFirestoreInputType,
  ProductCategoriesFirestoreInputType,
  OrderFirestoreType,
  OrdersFirestoreType,
};
