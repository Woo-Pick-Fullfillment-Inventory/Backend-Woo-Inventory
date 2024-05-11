import {
  MongoBatchSizeExceededError,
  MongoDataWriteError,
} from "../../../constants/error/mongo-error.constant.js";
import { MONGO_ALLOWED_BATCH_SIZE } from "../../../constants/size.constant.js";
import logger from "../../../modules/create-logger.js";

import type {
  ProductMongoInputType,
  ShopType,
} from "../index.js";
import type {
  BulkWriteResult,
  MongoClient,
} from "mongodb";

/**
 * Factory An asynchronous function that insert products in bulk and returns the total number of operations.
 *
 * @param userId - id of the user.
 * @returns The total number of operations. only if the total operations match the products length.
 * @returns The collection should be named `user-${userId}-products` and be empty at initialization.
 * @throws MongoBatchSizeExceededError when the batch size exceeds the limit.
 * @throws MongoDataWriteError when the total operations do not match the products length.
 */
export const batchWriteProductsFactory = (mongoClient: MongoClient) => {
  return async ({
    data,
    userId,
    shop,
  }: {
    data: ProductMongoInputType[];
    userId: string;
    shop: ShopType;
  }): Promise<number> => {
    if (data.length > MONGO_ALLOWED_BATCH_SIZE) {
      logger.log(
        "error",
        `Mongo: batch size ${data.length} exceeded the limit.`,
      );
      throw new MongoBatchSizeExceededError();
    }

    const productsCollection = mongoClient
      .db(`shop-${shop}-${userId}`)
      .collection("products");

    const bulk = productsCollection.initializeUnorderedBulkOp();

    // Create bulk operations
    data.forEach((product) => {
      bulk.insert(product);
    });

    const result: BulkWriteResult = await bulk.execute();

    const totalOperations =
      result.insertedCount +
      result.matchedCount +
      result.modifiedCount +
      result.upsertedCount +
      result.deletedCount;

    if (totalOperations !== data.length) {
      logger.log(
        "error",
        `Mongo: total operations ${totalOperations} does not match the products length ${data.length}.`,
      );
      throw new MongoDataWriteError();
    }

    return totalOperations;
  };
};
