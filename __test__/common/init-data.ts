import {
  mockUserDidntSync,
  mockUserForAddingProduct,
  mockUserForSyncingOrders,
  mockUserForSyncingProducts,
  mockUserForSyncingProductsFalsyTypeProductReturn,
  mockUserWithHashedPassword,
  mockUserWrongType,
} from "./mock-data.js";
import { mongoRepository } from "../../src/repository/mongo/index.js";
import mongoClient from "../../src/repository/mongo/init-mongo.js";

export const initDbTest = async () => {
  await mongoClient
    .db("users")
    .collection("woo-users")
    .insertMany([
      mockUserWithHashedPassword,
      mockUserWrongType,
      mockUserDidntSync,
      mockUserForSyncingProducts,
      mockUserForSyncingOrders,
      mockUserForSyncingProductsFalsyTypeProductReturn,
      mockUserForAddingProduct,
    ]);
};

export const initDbWithIndexTest = async (userId: string) => {
  await mongoRepository.database.setupDatabase({
    userId,
    shop: "woo",
  });
};

export const clearDbTest = async (userId: string) => {
  await mongoClient
    .db(`shop-woo-${userId}`)
    .collection("products")
    .deleteMany({});
  await mongoClient
    .db(`shop-woo-${userId}`)
    .collection("orders")
    .deleteMany({});
  await mongoClient
    .db(`shop-woo-${userId}`)
    .collection("categories")
    .deleteMany({});
  await mongoClient
    .db("users")
    .collection("woo-users")
    .deleteMany({});
};

export const clearDbUserTest = async() => {
  await mongoClient
    .db("users")
    .collection("woo-users")
    .deleteMany({});
};