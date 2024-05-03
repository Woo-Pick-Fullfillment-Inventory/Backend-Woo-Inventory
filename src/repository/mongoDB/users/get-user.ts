import { ERRORS } from "../../../constants/error.constant.js";
import logger from "../../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../../modules/create-response-type-guard.js";
import {
  type UserAttributeType,
  UserMongoSchema,
  type UserMongoType,
} from "../models/user.type.js";

import type {
  Collection,
  Document,
} from "mongodb";

export const getUserFactory = (userCollection: Collection<Document>) => {
  return (userAttribute: UserAttributeType) => {
    return async (
      attributeValue: string,
    ): Promise<UserMongoType | undefined> => {
      const query = { [userAttribute]: attributeValue };
      const user = await userCollection.findOne(query);

      if (!user) return undefined;
      const isUserTypeValid = isResponseTypeTrue(UserMongoSchema, user, true);
      if (!isUserTypeValid.isValid) {
        logger.log(
          "warn",
          `***ERROR*** invalid user response type  ${isUserTypeValid.errorMessage} **Expected** ${JSON.stringify(
            UserMongoSchema,
          )} **RECEIVED** ${JSON.stringify(user)}`,
        );
        throw new Error(ERRORS.INVALID_REPOSNE_TYPE);
      }
      return user as unknown as UserMongoType;
    };
  };
};
