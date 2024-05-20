import { batchWriteProductsCategoriesFactory } from "./categories/batch-write-categories.js";
import { getProductsCategoriesFactory } from "./categories/get-categories.js";
import { countDocumentsFactory } from "./collection/count-documents.js";
import { setupDatabaseFactory } from "./collection/create-collection.js";
import mongoClient from "./init-mongo.js";
import {
  ProductCategoryMongoInputSchema,
  ProductsCategoriesMongoSchema,
  ProductsCategoryMongoSchema,
} from "./models/category.type.js";
import {
  OrderMongoInputSchema,
  OrderMongoSchema,
} from "./models/order.type.js";
import {
  AddProductMongoSchema,
  ProductMongoSchema,
  ProductsMongoSchema,
} from "./models/product.type.js";
import { UserMongoSchema } from "./models/user.type.js";
import { batchWriteOrdersFactory } from "./orders/batch-write-orders.js";
import { getOrdersFactory } from "./orders/get-orders.js";
import { batchWriteProductsFactory } from "./products/batch-write-products.js";
import { getProductsFactory } from "./products/get-products.js";
import { insertProductFactory } from "./products/insert-product.js";
import { getUserFactory } from "./users/get-user.js";
import { insertUserFactory } from "./users/insert-user.js";
import { updateUserFactory } from "./users/update-user.js";

import type {
  ProductCategoryMongoInputType,
  ProductsCategoriesMongoClientType,
  ProductsCategoriesMongoType,
  ProductsCategoryMongoClientType,
  ProductsCategoryMongoType,
} from "./models/category.type.js";
import type {
  OrderMongoInputType,
  OrderMongoType,
  OrderStatusType,
  PickingStatusType,
} from "./models/order.type.js";
import type {
  AddProductMongoType,
  ProductMongoAttributeType,
  ProductMongoInputType,
  ProductMongoType,
} from "./models/product.type.js";
import type { ShopType } from "./models/shop.type.js";
import type {
  UserAttributeType,
  UserMongoType,
  UserUpdateAttributeType,
} from "./models/user.type.js";

const usersMongoDatabase = mongoClient.db(process.env["MONGO_USERS_DATABASE"] as string);

export type {
  UserAttributeType,
  UserUpdateAttributeType,
  UserMongoType,
  ProductMongoInputType,
  ProductMongoType,
  ProductMongoAttributeType,
  AddProductMongoType,
  ProductsCategoriesMongoType,
  ProductsCategoryMongoType,
  ProductsCategoryMongoClientType,
  ProductsCategoriesMongoClientType,
  ProductCategoryMongoInputType,
  OrderMongoType,
  OrderMongoInputType,
  ShopType,
  PickingStatusType,
  OrderStatusType,
};

export {
  UserMongoSchema,
  ProductMongoSchema,
  ProductsMongoSchema,
  AddProductMongoSchema,
  ProductsCategoryMongoSchema,
  ProductsCategoriesMongoSchema,
  ProductCategoryMongoInputSchema,
  OrderMongoSchema,
  OrderMongoInputSchema,
};

export const mongoRepository = {
  user: {
    insertUser: insertUserFactory(usersMongoDatabase),
    getUserByEmail: getUserFactory(usersMongoDatabase)("email"),
    getUserByUsername: getUserFactory(usersMongoDatabase)("username"),
    getUserById: getUserFactory(usersMongoDatabase)("id"),
    updateUserLastLogin: updateUserFactory(usersMongoDatabase)("last_login"),
    updateUserProductsSynced: updateUserFactory(usersMongoDatabase)(
      "sync.are_products_synced",
    ),
    updateUserProductsCategoriesSynced: updateUserFactory(usersMongoDatabase)(
      "sync.are_products_categories_synced",
    ),
    updateUserOrdersSynced: updateUserFactory(usersMongoDatabase)(
      "sync.are_orders_synced",
    ),
  },
  product: {
    batchWriteProducts: batchWriteProductsFactory(mongoClient),
    getProducts: getProductsFactory(mongoClient),
    insertProduct: insertProductFactory(mongoClient),
  },
  collection: { countDocuments: countDocumentsFactory(mongoClient) },
  category: {
    batchWriteProductsCategories: batchWriteProductsCategoriesFactory(mongoClient),
    getProductsCategories: getProductsCategoriesFactory(mongoClient),
  },
  order: {
    batchWriteOrders: batchWriteOrdersFactory(mongoClient),
    getOrders: getOrdersFactory(mongoClient),
  },
  database: { setupDatabase: setupDatabaseFactory(mongoClient) },
};