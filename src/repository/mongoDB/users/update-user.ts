import { ERRORS } from "../../../constants/error.constant.js";

import type { UserUpdateAttributeType } from "../models/user.type.js";
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
      const query = { user_id: userId };
      const update = { $set: { [userAttribute]: attributeValue } };
      const options = { upsert: false };

      const result = await userCollection.updateOne(query, update, options);
      if (result.modifiedCount === 0) {
        throw new Error(ERRORS.DATA_NOT_MODIFIED);
      }
    };
  };
};
