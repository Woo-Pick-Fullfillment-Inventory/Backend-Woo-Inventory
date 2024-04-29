import { PRODUCT_PER_PAGE } from "../constants/size.constant.js";
import {
  type OrdersWooType,
  wooApiRepository,
} from "../repository/woo-api/index.js";

const fetchordersBatch = async (
  baseUrl: string,
  wooBasicAuth: string,
  currentPage: number,
) => {
  const result = await wooApiRepository.order.getOrdersPagination({
    baseUrl: baseUrl,
    token: wooBasicAuth,
    perPage: PRODUCT_PER_PAGE,
    page: currentPage,
  });
  return result.orders;
};

const fetchAllorders = async ({
  baseUrl,
  wooBasicAuth,
  totalItems,
}: {
  baseUrl: string;
  wooBasicAuth: string;
  totalItems: number;
}): Promise<OrdersWooType> => {
  let currentChunk = 1;
  let shouldContinue = true;
  let allordersToBeSynced: OrdersWooType = [];
  let totalChunks = Math.ceil(totalItems / 50);

  while (shouldContinue) {
    const numBatches = totalChunks >= 4 ? 4 : Math.ceil(totalItems / 50);

    const promises: Promise<OrdersWooType>[] = [];

    for (let i = 0; i < numBatches; i++) {
      promises.push(fetchordersBatch(baseUrl, wooBasicAuth, currentChunk));
      currentChunk += 1;
    }

    const results = await Promise.all(promises);

    allordersToBeSynced = allordersToBeSynced.concat(...results);

    if (
      results.some((result) => result.length === 0) ||
      currentChunk > totalChunks
    ) {
      shouldContinue = false;
      break;
    }

    totalChunks -= numBatches;
    if (totalItems > 200) totalItems -= 200;
  }

  return allordersToBeSynced;
};

export default fetchAllorders;
