import {
  MongoDataConflictError,
  MongoDataNotModifiedError,
} from "../../../constants/error/mongo-error.constant.js";

import type {
  AddProductMongoType,
  ShopType,
} from "../index.js";
import type { MongoClient } from "mongodb";

export const insertProductFactory = (mongoClient: MongoClient) => {
  return async ({
    product,
    userId,
    shop,
  }: {
    product: AddProductMongoType;
    userId: string;
    shop: ShopType;
  }): Promise<void> => {
    const productsCollection = mongoClient
      .db(`shop-${shop}-${userId}`)
      .collection("products");

    // sku , barcode is unique
    // sku, barcode can be empty string for now
    const existingProduct = await productsCollection.findOne({
      $or: [
        { sku: product.sku },
        { id: product.id },
      ],
    });
    if (existingProduct) throw new MongoDataConflictError();

    const result = await productsCollection.insertOne(product);
    if (!result.acknowledged) throw new MongoDataNotModifiedError();
  };
};
