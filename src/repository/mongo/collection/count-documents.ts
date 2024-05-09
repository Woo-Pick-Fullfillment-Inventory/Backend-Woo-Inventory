import type { MongoClient } from "mongodb";

export const countDocumentsFactory = (mongoClient: MongoClient) => {
  return async (collectionName: string): Promise<number> => {
    const collection = mongoClient
      .db(process.env["MONGO_INITDB_DATABASE"] as string)
      .collection(collectionName);
    return collection.countDocuments();
  };
};