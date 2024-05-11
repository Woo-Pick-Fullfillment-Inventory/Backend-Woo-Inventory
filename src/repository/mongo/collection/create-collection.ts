import type { ShopType } from "../index.js";
import type { MongoClient } from "mongodb";

export const setupDatabaseFactory = (mongoClient: MongoClient) => {
  return async ({
    userId,
    shop,
  }: {
    userId: string;
    shop: ShopType;
  }): Promise<void> => {
    const db = mongoClient.db(`shop-${shop}-${userId}`);
    await db.createCollection("products");
    await db.createCollection("categories");
    await db.createCollection("orders");
    const productsCollection = db.collection("products");
    const categoriesCollection = db.collection("categories");
    const ordersCollection = db.collection("orders");
    await productsCollection.createIndex({ id: 1 }, { unique: true });
    await productsCollection.createIndex({ stock_quantity: 1 });
    await productsCollection.createIndex({ price: 1 });
    await productsCollection.createIndex({ expiration_date: 1 });
    await productsCollection.createIndex({ name: 1 });
    await productsCollection.createIndex({ sku: 1 }, { unique: true });
    // Define any necessary indexes for "categories" if required.
    await categoriesCollection.createIndex({ id: 1 }, { unique: true });
    await categoriesCollection.createIndex({ name: 1 });
    await ordersCollection.createIndex({ id: 1 }, { unique: true });
    await ordersCollection.createIndex(
      { status: 1 },
      { partialFilterExpression: { status: "processing" } },
    );
  };
};
