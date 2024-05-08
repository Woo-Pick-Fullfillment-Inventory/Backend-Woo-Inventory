import { ERRORS } from "../../../constants/error.constant.js";

import type { AddProductMongoType } from "../index.js";
import type { MongoClient } from "mongodb";

export const insertProductFactory = (mongoClient: MongoClient) => {
  return async (product: AddProductMongoType, userId: string): Promise<void> => {
    const productCollection = mongoClient
      .db("test-database")
      .collection(`user-${userId}-products`);
    const existingProduct = await productCollection.findOne({
      $or: [
        { sku: product.sku },
        { id: product.id },
      ],
    });

    if (existingProduct) {
      throw new Error(ERRORS.DATA_ALREADY_EXISTS);
    }

    const { acknowledged } = await productCollection.insertOne(product);

    if (!acknowledged) {
      throw new Error(ERRORS.DATA_NOT_INSERTED);
    }

    console.log("Product added successfully.");
  };
};