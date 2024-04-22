import createAxiosClient from "../../../modules/create-axios-client.js";
import logger from "../../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../../modules/create-response-type-guard.js";
import {
  ProductsCategoriesFromWooSchema,
  type ProductsCategoriesFromWooType,
  ProductsFromWooSchema,
} from "../index.js";

import type {
  AxiosError,
  AxiosResponse,
} from "axios";

type getAllProductsPaginationResponse = {
  categories: ProductsCategoriesFromWooType;
  totalItems: number;
  totalPages: number;
};

export const getProductsCategoriesPaginationFactory = async ({
  baseUrl,
  token,
  perPage,
  page,
}: {
  baseUrl: string;
  token: string;
  perPage: number;
  page: number;
}): Promise<getAllProductsPaginationResponse> => {
  const { get } = createAxiosClient<ProductsCategoriesFromWooType>({
    config: {
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    interceptors: [
      {
        onTrue: (response: AxiosResponse) => {
          if (response.status !== 200) {
            logger.log(
              "error",
              `onTrue Intercepted: request ${baseUrl}${response.config.url}${response.config.url} 
               with status code ${response.status} is not expected`,
            );
            throw new Error("Response status code not expected");
          }
          const isProductsCategoriesTypeValid = isResponseTypeTrue(
            ProductsCategoriesFromWooSchema,
            response.data,
            true,
          );
          if (!isProductsCategoriesTypeValid.isValid) {
            logger.log(
              "error",
              `onTrue Intercepted: request ${baseUrl}${response.config.url}${response.config.url} response error ${isProductsCategoriesTypeValid.errorMessage}` +
                ` ***Expected*** ${JSON.stringify(ProductsFromWooSchema)} ***Received*** ${JSON.stringify(response.data)}`,
            );
            throw new Error("Response type not expected");
          }
          return response;
        },
        onError: (error: AxiosError) => {
          if (error.config) {
            logger.log(
              "error",
              `onError Intercepted: request ${baseUrl}${error.config.url}, ${JSON.stringify(error)}`,
            );
          }
          throw new Error("Axios Error");
        },
      },
    ],
  });

  const {
    data,
    headers,
  } = await get(
    `/wp-json/wc/v3/products/categories?per_page=${perPage}&page=${page}`,
    { headers: { Authorization: token } },
  );

  if (
    headers["x-wp-total"] === undefined ||
    headers["x-wp-totalpages"] === undefined
  ) {
    throw new Error("Response headers not expected");
  }

  return {
    categories: data.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      parent: category.parent,
      description: category.description,
      display: category.display,
      image: category.image ? {
        id: category.image.id,
        src: category.image.src,
      } : null,
      menu_order: category.menu_order || null,
      count: category.count || null,
    })),
    totalItems: parseInt(headers["x-wp-total"] as string, 10),
    totalPages: parseInt(headers["x-wp-totalpages"] as string, 10),
  };
};
