import type { ProductMongoType } from "../index.js";
import type {
  MongoClient,
  SortDirection,
} from "mongodb";

type SortOptionType = {
  attribute: string;
  direction: SortDirection;
  page: number;
  per_page: number;
};

export const getProductsFactory = (mongoClient: MongoClient) => {
  return async (userId: string, sortOption: SortOptionType): Promise<ProductMongoType[]> => {
    const productsCollection = mongoClient
      .db("test-database")
      .collection(`user-${userId}-products`);

    const sortDirection = sortOption.direction === "asc" ? 1 : -1;

    const skip = (sortOption.page-1) * sortOption.per_page;

    const products = await productsCollection.find({})
      .sort({ [sortOption.attribute]: sortDirection })
      .skip(skip)
      .limit(sortOption.per_page)
      .toArray();

    // todo: add type validation
    return products as unknown as ProductMongoType[];
  };
};
