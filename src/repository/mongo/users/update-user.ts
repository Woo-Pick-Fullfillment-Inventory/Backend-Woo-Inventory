import { MongoDataNotModifiedError } from "../../../constants/error/mongo-error.constant.js";

import type { UserUpdateAttributeType } from "../index.js";
import type {
  Collection,
  Document,
} from "mongodb";

export const updateUserFactory = (userCollection: Collection<Document>) => {
  return (userAttribute: UserUpdateAttributeType) => {
    return async (
      userId: string,
      attributeValue: string | boolean,
    ): Promise<void> => {
      const query = { id: userId };
      const update = { $set: { [userAttribute]: attributeValue } };
      const options = { upsert: false };

      const result = await userCollection.updateOne(query, update, options);
      if (result.modifiedCount === 0) throw new MongoDataNotModifiedError();
    };
  };
};
