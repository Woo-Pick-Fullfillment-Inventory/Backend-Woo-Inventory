import type { OrderMongoType } from "../index.js";
import type { MongoClient } from "mongodb";

export const getOrdersFactory = (
  mongoClient: MongoClient,
) => {
  return async (userId: string): Promise<OrderMongoType[]> => {
    const Orders = await mongoClient
      .db(process.env["MONGO_INITDB_DATABASE"] as string)
      .collection(`user-${userId}-orders`)
      .find()
      .toArray();

    // todo: add type validation
    return Orders as unknown as OrderMongoType[];
  };
};