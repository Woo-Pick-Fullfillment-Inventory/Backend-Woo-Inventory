import type {
  ShopType,
  UserAttributeType,
  UserMongoType,
} from "../index.js";
import type { Db } from "mongodb";

export const getUserFactory = (usersMongoDatabase: Db) => {
  return (userAttribute: UserAttributeType) => {
    return async (
      attributeValue: string,
      shop: ShopType,
    ): Promise<UserMongoType | undefined> => {
      const userCollection = usersMongoDatabase.collection(`${shop}-users`);

      const query = { [userAttribute]: attributeValue };
      const user = await userCollection.findOne(query);

      if (!user) return undefined;
      return user as unknown as UserMongoType;
    };
  };
};
