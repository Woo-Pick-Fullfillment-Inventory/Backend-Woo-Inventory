import type { MongoClient } from "mongodb";

export const clearCollectionFactory = (mongoClient: MongoClient) => {
  return async (collectionName: string): Promise<void> => {
    const collection = mongoClient.db(process.env["MONGO_INITDB_DATABASE"] as string).collection(collectionName);

    await collection.deleteMany({});
    console.log(`Cleared all documents from the '${collectionName}' collection.`);
  };
};