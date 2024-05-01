import { wooApiRepository } from "../repository/woo-api/index.js";

type FetchDataBatchParams = {
  baseUrl: string;
  wooBasicAuth: string;
  currentPage: number;
  endpoint: "order" | "product" | "productCategories";
  perPage: number;
  dateAfter?: string;
  status?: string[];
}

type fetchAllDataFromWooParams = {
  baseUrl: string;
  wooBasicAuth: string;
  totalItems: number;
  endpoint: "order" | "product" | "productCategories";
  perPage: number;
  dateAfter?: string;
  status?: string[];
}

// Generic function for fetching data with pagination and batching
const fetchDataBatch = async <T>({
  baseUrl,
  wooBasicAuth,
  currentPage,
  endpoint,
  perPage,
  dateAfter,
  status,
}: FetchDataBatchParams): Promise<T[]> => {
  let result;
  switch (endpoint) {
    case "order":
      if (!dateAfter || !status) throw new Error("dateAfter and status are required for fetching orders");
      result = await wooApiRepository.order.getOrdersPagination({
        baseUrl,
        token: wooBasicAuth,
        perPage,
        page: currentPage,
        dateAfter,
        status,
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

const fetchAllDataFromWoo = async <T>({
  baseUrl,
  wooBasicAuth,
  totalItems,
  endpoint,
  perPage,
  dateAfter,
  status,
}: fetchAllDataFromWooParams): Promise<T[]> => {
  let currentChunk = 1;
  let shouldContinue = true;
  let allDataToBeSynced: T[] = [];
  let totalChunks = Math.ceil(totalItems / 100);

  while (shouldContinue) {
    const numBatches = totalChunks >= 4 ? 4 : Math.ceil(totalItems / 100);

    const promises: Promise<T[]>[] = [];

    for (let i = 0; i < numBatches; i++) {
      promises.push(fetchDataBatch<T>({
        baseUrl,
        wooBasicAuth,
        currentPage: currentChunk,
        endpoint,
        perPage,
        // eslint-disable-next-line
        dateAfter: dateAfter!,     
        // eslint-disable-next-line
        status: status!,
      }));
      currentChunk += 1;
    }

    const results = await Promise.all(promises);

    allDataToBeSynced = allDataToBeSynced.concat(...results);

    if (results.some((result) => result.length === 0) || currentChunk > totalChunks) {
      shouldContinue = false;
    }

    totalChunks -= numBatches;
    if (totalItems > 400) totalItems -= 400;
  }

  return allDataToBeSynced;
};

export default fetchAllDataFromWoo;
