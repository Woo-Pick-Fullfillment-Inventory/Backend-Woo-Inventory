import type {
  UserAttributeType,
  UserMongoType,
} from "../index.js";
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
      // todo: add type validation
      return user as unknown as UserMongoType;
    };
  };
};
