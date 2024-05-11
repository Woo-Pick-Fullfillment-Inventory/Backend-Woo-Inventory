import type { ShopType } from "../index.js";
import type { MongoClient } from "mongodb";

export const countDocumentsFactory = (mongoClient: MongoClient) => {
  return async ({
    userId,
    shop,
    collectionName,
  }: {
    userId: string;
    shop: ShopType;
    collectionName: string;
  }): Promise<number> => {
    const collection = mongoClient
      .db(`shop-${shop}-${userId}`)
      .collection(collectionName);
    return collection.countDocuments();
  };
};
