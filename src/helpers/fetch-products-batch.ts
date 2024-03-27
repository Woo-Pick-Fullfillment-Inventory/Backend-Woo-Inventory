import { wooApiRepository } from "../repository/woo-api/index.js";

import type { ProductsType } from "../repository/woo-api/models/products.type.js";

const fetchProductsBatch = async (
  base_url: string,
  wooBasicAuth: string,
  currentPage: number,
) => {
  const result = await wooApiRepository.product.getProductsPagination(
    base_url,
    wooBasicAuth,
    50,
    currentPage,
  );
  return result.products;
};

const fetchAllProducts = async (
  base_url: string,
  wooBasicAuth: string,
  totalItems: number,
): Promise<ProductsType> => {
  let currentChunk = 1;
  let shouldContinue = true;
  let allProductsToBeSynced: ProductsType = [];
  let totalChunks = Math.ceil(totalItems / 50);

  while (shouldContinue) {
    const numBatches = totalChunks >= 4 ? 4 : Math.ceil(totalItems / 50);

    const promises: Promise<ProductsType>[] = [];

    for (let i = 0; i < numBatches; i++) {
      promises.push(fetchProductsBatch(base_url, wooBasicAuth, currentChunk));
      currentChunk += 1;
    }

    const results = await Promise.all(promises);

    allProductsToBeSynced = allProductsToBeSynced.concat(...results);

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

  return allProductsToBeSynced;
};

export default fetchAllProducts;
