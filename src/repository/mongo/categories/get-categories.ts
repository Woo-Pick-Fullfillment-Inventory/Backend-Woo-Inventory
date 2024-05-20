import type {
  ProductsCategoryMongoType,
  ShopType,
} from "../index.js";
import type { MongoClient } from "mongodb";

export const getProductsCategoriesFactory = (
  mongoClient: MongoClient,
) => {
  return async (userId: string, shop: ShopType): Promise<ProductsCategoryMongoType[]> => {
    const categories = await mongoClient
      .db(`shop-${shop}-${userId}`)
      .collection("categories")
      .find()
      .toArray();

    // type validation on API
    return categories as unknown as ProductsCategoryMongoType[];
  };
};