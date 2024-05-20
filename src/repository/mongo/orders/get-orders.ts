import type {
  OrderMongoType,
  OrderStatusType,
} from "../index.js";
import type { MongoClient } from "mongodb";

type SearchOptions = {
  date_from: string;
  date_to: string;
  status: OrderStatusType[];
  page?: number;
  per_page?: number;
  search_term?: string;
  sorting_criteria: {
    field: "date_created";
    direction: "asc" | "desc";
  };
};

type QueryType = {
  date_created: {
    $gte: string;
    $lte: string;
  };
  status: {
    $in: OrderStatusType[];
  };
  $or?: Array<{ [key: string]: { $regex?: RegExp; $eq?: number } }>;
};

export const getOrdersFactory = (mongoClient: MongoClient) => {
  return async ({
    userId,
    shop,
    searchOptions,
  }: {
    userId: string;
    shop: string;
    searchOptions: SearchOptions;
  }): Promise<OrderMongoType[]> => {
    const ordersCollection = mongoClient
      .db(`shop-${shop}-${userId}`)
      .collection("orders");

    const query: QueryType = {
      date_created: {
        $gte: searchOptions.date_from,
        $lte: searchOptions.date_to,
      },
      status: { $in: searchOptions.status },
    };

    // Add search term condition if provided
    if (searchOptions.search_term) {
      const searchTerm = searchOptions.search_term;

      // Assuming the `id` field can be either string or number
      query.$or = [
        { id: { $regex: new RegExp(searchTerm, "i") } },
        { id: { $eq: parseFloat(searchTerm) } },
        { "shipping.first_name": { $regex: new RegExp(searchTerm, "i") } },
        { "shipping.last_name": { $regex: new RegExp(searchTerm, "i") } },
      ];
    }

    const cursor = ordersCollection.find(query).sort({
      [searchOptions.sorting_criteria.field]:
        searchOptions.sorting_criteria.direction === "asc" ? 1 : -1,
    });

    if (searchOptions.page && searchOptions.per_page) {
      const skip = (searchOptions.page - 1) * searchOptions.per_page;
      cursor.skip(skip).limit(searchOptions.per_page);
    }

    return (await cursor.toArray()) as unknown as OrderMongoType[];
  };
};
