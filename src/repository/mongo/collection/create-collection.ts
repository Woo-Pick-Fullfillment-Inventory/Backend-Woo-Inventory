import type { MongoClient } from "mongodb";

type CaseType = "products" | "categories" | "orders";

export const createCollectionFactory = (mongoClient: MongoClient) => {
  return async ({
    collectionName,
    caseType,
  }: {
    collectionName: string;
    caseType: CaseType;
  }): Promise<void> => {
    const db = mongoClient.db(process.env["MONGO_INITDB_DATABASE"] as string);
    await db.createCollection(collectionName);
    const collection = db.collection(collectionName);

    switch (caseType) {
      case "products":
        await collection.createIndex({ id: 1 }, { unique: true });
        await collection.createIndex({ stock_quantity: 1 });
        await collection.createIndex({ price: 1 });
        await collection.createIndex({ expiration_date: 1 });
        await collection.createIndex({ name: 1 });
        await collection.createIndex({ sku: 1 }, { unique: true });
        break;

      case "categories":
        // Define any necessary indexes for "categories" if required.
        await collection.createIndex({ id: 1 }, { unique: true });
        await collection.createIndex({ name: 1 });
        break;

      case "orders":
        await collection.createIndex({ id: 1 }, { unique: true });
        await collection.createIndex({ status: 1 }, { partialFilterExpression: { status: "processing" } });
        break;

      default:
        console.log("No specific indexes to create for this case.");
        break;
    }
  };
};
