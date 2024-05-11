import { MONGO_ALLOWED_BATCH_SIZE } from "../constants/size.constant.js";
import delay from "../helpers/delay.js";
import { mongoRepository } from "../repository/mongo/index.js";

import type {
  OrderMongoInputType,
  ProductCategoryMongoInputType,
  ProductMongoInputType,
  ShopType,
} from "../repository/mongo/index.js";

type CaseType = "products" | "categories" | "orders";

export const writeDataToMongoBatch = async ({
  data,
  userId,
  shop,
  caseType,
}: {
  data: ProductMongoInputType[] | OrderMongoInputType[] | ProductCategoryMongoInputType[];
  userId: string;
  shop: ShopType;
  caseType: CaseType;
}): Promise<number> => {
  let insertedCount = 0;

  if (caseType === "products") {
    for (let i = 0; i < data.length; i += MONGO_ALLOWED_BATCH_SIZE) {
      const dataSlice = data.slice(i, i + MONGO_ALLOWED_BATCH_SIZE);
      insertedCount += await mongoRepository.product.batchWriteProducts({
        data: dataSlice as ProductMongoInputType[],
        userId,
        shop,
      });
      await delay(1000);
    }
  }

  if (caseType === "orders") {
    for (let i = 0; i < data.length; i += MONGO_ALLOWED_BATCH_SIZE) {
      const dataSlice = data.slice(i, i + MONGO_ALLOWED_BATCH_SIZE);
      insertedCount += await mongoRepository.order.batchWriteOrders({
        data: dataSlice as OrderMongoInputType[],
        userId,
        shop,
      });
      await delay(1000);
    }
  }

  if (caseType === "categories") {
    for (let i = 0; i < data.length; i += MONGO_ALLOWED_BATCH_SIZE) {
      const dataSlice = data.slice(i, i + MONGO_ALLOWED_BATCH_SIZE);
      insertedCount += await mongoRepository.category.batchWriteProductsCategories({
        data: dataSlice as ProductCategoryMongoInputType[],
        userId,
        shop,
      });
      await delay(1000);
    }
  }

  return insertedCount;
};
