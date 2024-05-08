import type { MongoClient } from "mongodb";

export const countDocumentsFactory = (mongoClient: MongoClient) => {
  return async (collectionName: string): Promise<number> => {
    const collection = mongoClient
      .db("test-database")
      .collection(collectionName);
    return collection.countDocuments();
  };
};