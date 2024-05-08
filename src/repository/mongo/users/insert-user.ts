import { ObjectId } from "mongodb";

import { ERRORS } from "../../../constants/error.constant.js";

import type { UserMongoType } from "../index.js";
import type {
  Collection,
  Document,
} from "mongodb";

/**
 * Factory function to insert a new user and return the inserted user.
 *
 * @param userCollection - MongoDB collection where users are stored.
 * @returns An asynchronous function that inserts a user and returns the newly inserted document.
 */
export const insertUserFactory = (userCollection: Collection<Document>) => {
  return async (
    user: Omit<UserMongoType, "user_id" | "_id">,
  ): Promise<UserMongoType> => {
    const newUserId = new ObjectId();
    const result = await userCollection.insertOne({
      _id: newUserId,
      user_id: newUserId.toHexString(),
      ...user,
    });

    if (!result.acknowledged) {
      throw new Error(ERRORS.DATA_NOT_MODIFIED);
    }

    const insertedUser = await userCollection.findOne({ _id: result.insertedId });

    if (!insertedUser) {
      throw new Error(ERRORS.USER_NOT_FOUND);
    }

    return insertedUser as unknown as UserMongoType;
  };
};
