import { CATEGORIES_PER_PAGE } from "../constants/size.constant.js";
import {
  type ProductsCategoriesWooType,
  wooApiRepository,
} from "../repository/woo-api/index.js";

const fetchCategoriesBatch = async (
  baseUrl: string,
  wooBasicAuth: string,
  currentPage: number,
) => {
  const result = await wooApiRepository.product.getProductsCategoriesPagination({
    baseUrl: baseUrl,
    token: wooBasicAuth,
    perPage: CATEGORIES_PER_PAGE,
    page: currentPage,
  });
  return result.categories;
};

const fetchAllProductsCategories = async ({
  baseUrl,
  wooBasicAuth,
  totalItems,
}: {
  baseUrl: string;
  wooBasicAuth: string;
  totalItems: number;
}): Promise<ProductsCategoriesWooType> => {
  let currentChunk = 1;
  let shouldContinue = true;
  let allProductsCategoriesToBeSynced: ProductsCategoriesWooType = [];
  let totalChunks = Math.ceil(totalItems / 50);

  while (shouldContinue) {
    const numBatches = totalChunks >= 4 ? 4 : Math.ceil(totalItems / 50);

    const promises: Promise<ProductsCategoriesWooType>[] = [];

    for (let i = 0; i < numBatches; i++) {
      promises.push(fetchCategoriesBatch(baseUrl, wooBasicAuth, currentChunk));
      currentChunk += 1;
    }

    const results = await Promise.all(promises);

    allProductsCategoriesToBeSynced = allProductsCategoriesToBeSynced.concat(...results);

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

  return allProductsCategoriesToBeSynced;
};

export default fetchAllProductsCategories;