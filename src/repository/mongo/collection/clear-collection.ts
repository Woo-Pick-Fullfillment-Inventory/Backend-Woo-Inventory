import type { MongoClient } from "mongodb";

export const clearCollectionFactory = (mongoClient: MongoClient) => {
  return async (collectionName: string): Promise<void> => {
    const collection = mongoClient.db("test-database").collection(collectionName);

    await collection.deleteMany({});
    console.log(`Cleared all documents from the '${collectionName}' collection.`);
  };
};