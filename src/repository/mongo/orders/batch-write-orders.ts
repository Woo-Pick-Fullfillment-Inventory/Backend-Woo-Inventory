import {
  MongoBatchSizeExceededError,
  MongoDataWriteError,
} from "../../../constants/error/mongo-error.constant.js";
import { MONGO_ALLOWED_BATCH_SIZE } from "../../../constants/size.constant.js";
import logger from "../../../modules/create-logger.js";

import type { OrderMongoInputType } from "../index.js";
import type {
  BulkWriteResult,
  MongoClient,
} from "mongodb";

export const batchWriteOrdersFactory = (mongoClient: MongoClient) => {
  return async ({
    data,
    userId,
    shop,
  }: {
    data: OrderMongoInputType[];
    userId: string;
    shop: string;
  }): Promise<number> => {
    if (data.length > MONGO_ALLOWED_BATCH_SIZE) {
      logger.log(
        "error",
        `Mongo: batch size ${data.length} exceeded the limit.`,
      );
      throw new MongoBatchSizeExceededError();
    }

    const ordersCollection = mongoClient
      .db(`shop-${shop}-${userId}`)
      .collection("orders");

    const bulk = ordersCollection.initializeUnorderedBulkOp();

    data.forEach((order) => {
      bulk.insert(order);
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
        `Mongo: total operations ${totalOperations} does not match the orders length ${data.length}.`,
      );
      throw new MongoDataWriteError();
    }

    return totalOperations;
  };
};
