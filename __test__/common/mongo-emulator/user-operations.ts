// @ts-nocheck
import type { MongoClient } from "mongodb";

export const insertUserTest = (mongoClient: MongoClient) => {
  return async (user: any) => {
    return await mongoClient
      .db(process.env["MONGO_INITDB_DATABASE"] as string)
      .collection("users")
      .insertOne(user);
  };
};

export const insertUsersTest = (mongoClient: MongoClient) => {
  return async (users: any[]) => {
    return await mongoClient
      .db(process.env["MONGO_INITDB_DATABASE"] as string)
      .collection("users")
      .insertMany(users);
  };
};
