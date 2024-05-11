import { ObjectId } from "mongodb";

import { MongoDataNotModifiedError } from "../../../constants/error/mongo-error.constant.js";

import type {
  ShopType,
  UserMongoType,
} from "../index.js";
import type { Db } from "mongodb";

/**
 * Factory function to insert a new user and return the inserted user.
 *
 * @param userCollection - MongoDB collection where users are stored.
 * @returns An asynchronous function that inserts a user and returns the newly inserted document.
 */
export const insertUserFactory = (usersMongoDatabase: Db) => {
  return async (
    user: Omit<UserMongoType, "id" | "_id">,
    shop: ShopType,
  ): Promise<void> => {
    const usersCollection = usersMongoDatabase.collection(`${shop}-users`);

    const existingUser = await usersCollection.findOne({
      $or: [
        { email: user.email },
        { username: user.username },
      ],
    });
    if (existingUser) throw new MongoDataNotModifiedError();

    const newUserId = new ObjectId();
    const result = await usersCollection.insertOne({
      _id: newUserId,
      id: newUserId.toHexString(),
      ...user,
    });
    if (!result.acknowledged) throw new MongoDataNotModifiedError();
  };
};
