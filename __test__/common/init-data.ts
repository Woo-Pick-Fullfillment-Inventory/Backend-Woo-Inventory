import {
  mockUserDidntSync,
  mockUserForAddingProduct,
  mockUserForSyncingOrders,
  mockUserForSyncingProducts,
  mockUserForSyncingProductsFalsyTypeProductReturn,
  mockUserWithHashedPassword,
  mockUserWrongType,
} from "./mock-data.js";
import mongoClient from "../../src/repository/mongo/init-mongo.js";

export const initDbTest = async () => {
  await mongoClient
    .db("test-database")
    .collection("users")
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

export const clearDbTest = async (userId: string) => {
  await mongoClient
    .db("test-database")
    .collection(`user-${userId}-products`)
    .deleteMany({});
  await mongoClient
    .db("test-database")
    .collection(`user-${userId}-orders`)
    .deleteMany({});
  await mongoClient
    .db("test-database")
    .collection(`user-${userId}-categories`)
    .deleteMany({});
  await mongoClient
    .db("test-database")
    .collection("users")
    .deleteMany({});
};

export const clearDbUserTest = async() => {
  await mongoClient
    .db("test-database")
    .collection("users")
    .deleteMany({});
};