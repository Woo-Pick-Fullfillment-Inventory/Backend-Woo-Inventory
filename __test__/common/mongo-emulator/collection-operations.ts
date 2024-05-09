import type { MongoClient } from "mongodb";

export const clearCollectionTest = (mongoClient: MongoClient) => {
  return async (collection: string) => {
    return await mongoClient
      .db(process.env["MONGO_INITDB_DATABASE"] as string)
      .collection(collection)
      .deleteMany({});
  };
};
