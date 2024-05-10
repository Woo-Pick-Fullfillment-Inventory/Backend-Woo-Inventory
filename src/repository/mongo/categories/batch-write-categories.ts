import {
  MongoBatchSizeExceededError,
  MongoDataWriteError,
} from "../../../constants/error/mongo-error.constant.js";
import { MONGO_ALLOWED_BATCH_SIZE } from "../../../constants/size.constant.js";
import logger from "../../../modules/create-logger.js";

import type { ProductCategoryMongoInputType } from "../index.js";
import type {
  BulkWriteResult,
  MongoClient,
} from "mongodb";

export const batchWriteProductsCategoriesFactory = (
  mongoClient: MongoClient,
) => {
  return async (categories: ProductCategoryMongoInputType[], userId: string): Promise<number> => {
    if (categories.length > MONGO_ALLOWED_BATCH_SIZE) {
      logger.log("error", `Mongo: batch size ${categories.length} exceeded the limit.`);
      throw new MongoBatchSizeExceededError();
    }

    const bulk = mongoClient
      .db(process.env["MONGO_INITDB_DATABASE"] as string)
      .collection(`user-${userId}-categories`)
      .initializeUnorderedBulkOp();

    categories.forEach((category) => {
      bulk.insert(category);
    });

    const result: BulkWriteResult = await bulk.execute();

    const totalOperations =
            result.insertedCount +
            result.matchedCount +
            result.modifiedCount +
            result.upsertedCount +
            result.deletedCount;

    if (totalOperations !== categories.length) {
      logger.log("error", `Mongo: total operations ${totalOperations} does not match the categories length ${categories.length}.`);
      throw new MongoDataWriteError();
    }

    return totalOperations;
  };
};