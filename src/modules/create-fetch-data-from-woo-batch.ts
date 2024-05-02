import {
  CHUNKS_MAX_BATCH_SIZE_400,
  WOO_MAX_BATCH_SIZE,
} from "../constants/size.constant.js";
import { delayAction } from "../helpers/index.js";
import { wooApiRepository } from "../repository/woo-api/index.js";

type FetchDataBatchParams = {
  baseUrl: string;
  wooBasicAuth: string;
  currentPage: number;
  endpoint: "order" | "product" | "productCategories";
  perPage: number;
  dateAfter?: string;
  status?: string[];
};

type fetchAllDataFromWooParams = {
  baseUrl: string;
  wooBasicAuth: string;
  totalItems: number;
  endpoint: "order" | "product" | "productCategories";
  perPage: number;
  dateAfter?: string;
  status?: string[];
};

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
      if (!dateAfter || !status)
        throw new Error(
          "dateAfter and status are required for fetching orders",
        );
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

/**
 * Fetches all data from WooCommerce with periodic delays.
 * @param {object} params - Parameters for fetching data.
 * @param {string} params.baseUrl - The WooCommerce base URL.
 * @param {string} params.wooBasicAuth - Basic authentication token.
 * @param {number} params.totalItems - The total number of items to fetch.
 * @param {"order" | "product" | "productCategories"} params.endpoint - The WooCommerce endpoint.
 * @param {number} params.perPage - The number of items per page.
 * @param {string} [params.dateAfter] - Date filter for orders.
 * @param {string[]} [params.status] - Status filter for orders.
 * @returns {Promise<T[]>} A promise that resolves to the fetched data.
 * @function divide the total items into 400-items chunks
 * @function fetch data in batches of 400 items per chunk
 * @function delay for 10 seconds after every 20 requests - 2000 items
 */
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
  const totalChunks = Math.ceil(totalItems / WOO_MAX_BATCH_SIZE);

  while (shouldContinue) {
    const numBatches = totalChunks >= 4 ? 4 : Math.ceil(totalItems / WOO_MAX_BATCH_SIZE);

    const promises: Promise<T[]>[] = [];

    for (let i = 0; i < numBatches; i++) {
      promises.push(
        fetchDataBatch<T>({
          baseUrl,
          wooBasicAuth,
          currentPage: currentChunk,
          endpoint,
          perPage,
          // eslint-disable-next-line
          dateAfter: dateAfter!,
          // eslint-disable-next-line
          status: status!,
        }),
      );

      // overcome woocommerce API rate limit
      if (currentChunk % 20 === 0) await delayAction(10000);
      currentChunk += 1;
      if (currentChunk > totalChunks) {
        shouldContinue = false;
        break;
      }
    }

    const results = await Promise.all(promises);

    if (results.some((result) => result.length === 0)) {
      shouldContinue = false;
    }

    allDataToBeSynced = allDataToBeSynced.concat(...results);

    if (totalItems > CHUNKS_MAX_BATCH_SIZE_400) totalItems -= CHUNKS_MAX_BATCH_SIZE_400;
  }

  return allDataToBeSynced;
};

export default fetchAllDataFromWoo;
