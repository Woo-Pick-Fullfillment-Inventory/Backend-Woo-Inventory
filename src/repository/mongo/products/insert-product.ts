import {
  MongoDataConflictError,
  MongoDataNotModifiedError,
} from "../../../constants/error/mongo-error.constant.js";

import type { AddProductMongoType } from "../index.js";
import type { MongoClient } from "mongodb";

export const insertProductFactory = (mongoClient: MongoClient) => {
  return async (product: AddProductMongoType, userId: string): Promise<void> => {
    const productCollection = mongoClient
      .db(process.env["MONGO_INITDB_DATABASE"] as string)
      .collection(`user-${userId}-products`);

    const existingProduct = await productCollection.findOne({
      $or: [
        { sku: product.sku },
        { id: product.id },
      ],
    });
    if (existingProduct) throw new MongoDataConflictError();

    const result = await productCollection.insertOne(product);
    if (!result.acknowledged) throw new MongoDataNotModifiedError();
  };
};