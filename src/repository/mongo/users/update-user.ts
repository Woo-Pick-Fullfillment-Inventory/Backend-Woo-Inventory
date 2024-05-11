import { MongoDataNotModifiedError } from "../../../constants/error/mongo-error.constant.js";

import type {
  ShopType,
  UserUpdateAttributeType,
} from "../index.js";
import type { Db } from "mongodb";

export const updateUserFactory = (usersMongoDatabase: Db) => {
  return (userAttribute: UserUpdateAttributeType) => {
    return async (
      userId: string,
      attributeValue: string | boolean,
      shop: ShopType,
    ): Promise<void> => {
      const userCollection = usersMongoDatabase.collection(`${shop}-users`);
      const query = { id: userId };
      const update = { $set: { [userAttribute]: attributeValue } };
      const options = { upsert: false };

      const result = await userCollection.updateOne(query, update, options);
      if (result.modifiedCount === 0) throw new MongoDataNotModifiedError();
    };
  };
};
