import { wooApiRepository } from "../repository/woo-api/index.js";

type FetchDataBatchParams = {
  baseUrl: string;
  wooBasicAuth: string;
  currentPage: number;
  endpoint: "order" | "product" | "productCategories";
  perPage: number;
}

type fetchAllDataFromWooParams = {
  baseUrl: string;
  wooBasicAuth: string;
  totalItems: number;
  endpoint: "order" | "product" | "productCategories";
  perPage: number;
}

// Generic function for fetching data with pagination and batching
const fetchDataBatch = async <T>({
  baseUrl,
  wooBasicAuth,
  currentPage,
  endpoint,
  perPage,
}: FetchDataBatchParams): Promise<T[]> => {
  // Call the appropriate method from the WooCommerce repository based on the endpoint
  let result;
  switch (endpoint) {
    case "order":
      result = await wooApiRepository.order.getOrdersPagination({
        baseUrl,
        token: wooBasicAuth,
        perPage,
        page: currentPage,
      });
      return result.orders as T[];

    case "product":
      result = await wooApiRepository.product.getProductsPagination({
        baseUrl,
        token: wooBasicAuth,
        perPage,
        page: currentPage,
      });
      return result.products as T[];

    case "productCategories":
      result = await wooApiRepository.product.getProductsCategoriesPagination({
        baseUrl,
        token: wooBasicAuth,
        perPage,
        page: currentPage,
      });
      return result.categories as T[];

    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};

const fetchAllDataFromWooFromWoo = async <T>({
  baseUrl,
  wooBasicAuth,
  totalItems,
  endpoint,
  perPage,
}: fetchAllDataFromWooParams): Promise<T[]> => {
  let currentChunk = 1;
  let shouldContinue = true;
  let allDataToBeSynced: T[] = [];
  let totalChunks = Math.ceil(totalItems / 50);

  while (shouldContinue) {
    const numBatches = totalChunks >= 4 ? 4 : Math.ceil(totalItems / 50);

    const promises: Promise<T[]>[] = [];

    for (let i = 0; i < numBatches; i++) {
      promises.push(fetchDataBatch<T>({
        baseUrl,
        wooBasicAuth,
        currentPage: currentChunk,
        endpoint,
        perPage,
      }));
      currentChunk += 1;
    }

    const results = await Promise.all(promises);

    allDataToBeSynced = allDataToBeSynced.concat(...results);

    if (results.some((result) => result.length === 0) || currentChunk > totalChunks) {
      shouldContinue = false;
    }

    totalChunks -= numBatches;
    if (totalItems > 200) totalItems -= 200;
  }

  return allDataToBeSynced;
};

export default fetchAllDataFromWooFromWoo;
