import { ERRORS } from "../../../constants/error.constant.js";
import { MONGO_ALLOWED_BATCH_SIZE } from "../../../constants/size.constant.js";
import logger from "../../../modules/create-logger.js";

import type { OrderMongoInputType } from "../index.js";
import type {
  BulkWriteResult,
  MongoClient,
} from "mongodb";

export const batchWriteOrdersFactory = (
  mongoClient: MongoClient,
) => {
  return async (orders: OrderMongoInputType[], userId: string): Promise<void> => {
    if (orders.length > MONGO_ALLOWED_BATCH_SIZE) {
      logger.log("error", `Mongo: batch size ${orders.length} exceeded the limit.`);
      throw new Error(ERRORS.BATCH_SIZE_EXCEEDED);
    }

    const bulk = mongoClient
      .db(process.env["MONGO_INITDB_DATABASE"] as string)
      .collection(`user-${userId}-orders`)
      .initializeUnorderedBulkOp();

    orders.forEach((order) => {
      bulk.insert(order);
    });

    const result: BulkWriteResult = await bulk.execute();

    const totalOperations =
            result.insertedCount +
            result.matchedCount +
            result.modifiedCount +
            result.upsertedCount +
            result.deletedCount;

    if (totalOperations !== orders.length) {
      logger.log("error", `Mongo: total operations ${totalOperations} does not match the orders length ${orders.length}.`);
      throw new Error(ERRORS.BATCH_WRITE_FAILED);
    }
  };
};