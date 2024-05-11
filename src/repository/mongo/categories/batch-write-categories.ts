import {
  MongoBatchSizeExceededError,
  MongoDataWriteError,
} from "../../../constants/error/mongo-error.constant.js";
import { MONGO_ALLOWED_BATCH_SIZE } from "../../../constants/size.constant.js";
import logger from "../../../modules/create-logger.js";

import type {
  ProductCategoryMongoInputType,
  ShopType,
} from "../index.js";
import type {
  BulkWriteResult,
  MongoClient,
} from "mongodb";

export const batchWriteProductsCategoriesFactory = (
  mongoClient: MongoClient,
) => {
  return async ({
    data,
    userId,
    shop,
  }: {
    data: ProductCategoryMongoInputType[];
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

    const categoriesCollection = mongoClient
      .db(`shop-${shop}-${userId}`)
      .collection("categories");

    const bulk = categoriesCollection.initializeUnorderedBulkOp();

    data.forEach((category) => {
      bulk.insert(category);
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
        `Mongo: total operations ${totalOperations} does not match the categories length ${data.length}.`,
      );
      throw new MongoDataWriteError();
    }

    return totalOperations;
  };
};
