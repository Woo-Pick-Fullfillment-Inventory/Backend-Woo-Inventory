import { ERRORS } from "../../../constants/error.constant.js";
import { MONGO_ALLOWED_BATCH_SIZE } from "../../../constants/size.constant.js";
import logger from "../../../modules/create-logger.js";

import type { ProductMongoInputType } from "../index.js";
import type {
  BulkWriteResult,
  MongoClient,
} from "mongodb";

// Your product type

export const batchWriteProductsFactory = (mongoClient: MongoClient) => {
  return async (
    products: ProductMongoInputType[],
    userId: string,
  ): Promise<void> => {

    if (products.length > MONGO_ALLOWED_BATCH_SIZE) {
      logger.log("error", `Mongo: batch size ${products.length} exceeded the limit.`);
      throw new Error(ERRORS.BATCH_SIZE_EXCEEDED);
    }

    const bulk = mongoClient
      .db(process.env["MONGO_INITDB_DATABASE"] as string)
      .collection(`user-${userId}-products`)
      .initializeUnorderedBulkOp();

    // Create bulk operations
    products.forEach((product) => {
      bulk.insert(product);
    });

    const result: BulkWriteResult = await bulk.execute();

    const totalOperations =
      result.insertedCount +
      result.matchedCount +
      result.modifiedCount +
      result.upsertedCount +
      result.deletedCount;

    if (totalOperations !== products.length) {
      logger.log("error", `Mongo: total operations ${totalOperations} does not match the products length ${products.length}.`);
      throw new Error(ERRORS.BATCH_WRITE_FAILED);
    }
  };
};
