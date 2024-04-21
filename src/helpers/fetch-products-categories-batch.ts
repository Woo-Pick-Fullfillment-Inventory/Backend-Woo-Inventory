import {
  type ProductsCategoriesType,
  wooApiRepository,
} from "../repository/woo-api/index.js";

const PER_PAGE = 50;

const fetchCategoriesBatch = async (
  baseUrl: string,
  wooBasicAuth: string,
  currentPage: number,
) => {
  const result = await wooApiRepository.product.getProductsCategoriesPagination({
    baseUrl: baseUrl,
    token: wooBasicAuth,
    perPage: PER_PAGE,
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
}): Promise<ProductsCategoriesType> => {
  let currentChunk = 1;
  let shouldContinue = true;
  let allProductsToBeSynced: ProductsCategoriesType = [];
  let totalChunks = Math.ceil(totalItems / 50);

  while (shouldContinue) {
    const numBatches = totalChunks >= 4 ? 4 : Math.ceil(totalItems / 50);

    const promises: Promise<ProductsCategoriesType>[] = [];

    for (let i = 0; i < numBatches; i++) {
      promises.push(fetchCategoriesBatch(baseUrl, wooBasicAuth, currentChunk));
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

export default fetchAllProductsCategories;
