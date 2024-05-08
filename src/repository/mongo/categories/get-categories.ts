import type { ProductsCategoryMongoType } from "../index.js";
import type { MongoClient } from "mongodb";

export const getProductsCategoriesFactory = (
  mongoClient: MongoClient,
) => {
  return async (userId: string): Promise<ProductsCategoryMongoType[]> => {
    const categories = await mongoClient
      .db("test-database")
      .collection(`user-${userId}-categories`)
      .find()
      .toArray();

    // todo: add type validation
    return categories as unknown as ProductsCategoryMongoType[];
  };
};