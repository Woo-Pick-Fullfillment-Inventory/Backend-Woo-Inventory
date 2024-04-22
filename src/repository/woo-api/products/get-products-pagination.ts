import createAxiosClient from "../../../modules/create-axios-client.js";
import logger from "../../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../../modules/create-response-type-guard.js";
import {
  type ProductFromWooType,
  ProductsFromWooSchema,
  type ProductsFromWooType,
} from "../index.js";

import type {
  AxiosError,
  AxiosResponse,
} from "axios";

type getAllProductsPaginationResponse = {
  products: ProductFromWooType[];
  totalItems: number;
  totalPages: number;
};

export const getProductsPaginationFactory = async ({
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
  const { get } = createAxiosClient<ProductsFromWooType>({
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
          const isSystemStatusTypeValid = isResponseTypeTrue(
            ProductsFromWooSchema,
            response.data,
            true,
          );
          if (!isSystemStatusTypeValid.isValid) {
            logger.log(
              "error",
              `onTrue Intercepted: request ${baseUrl}${response.config.url}${response.config.url} response error ${isSystemStatusTypeValid.errorMessage}` +
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
    `/wp-json/wc/v3/products?per_page=${perPage}&page=${page}`,
    { headers: { Authorization: token } },
  );

  if (
    headers["x-wp-total"] === undefined ||
    headers["x-wp-totalpages"] === undefined
  ) {
    throw new Error("Response headers not expected");
  }

  return {
    products: data.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      slug: product.slug,
      categories: product.categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })),
      images: product.images.map((image) => ({
        id: image.id,
        src: image.src,
      })),
      price: product.price,
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      tax_class: product.tax_class,
      tax_status: product.tax_status,
      stock_quantity: product.stock_quantity,
    })),
    totalItems: parseInt(headers["x-wp-total"] as string, 10),
    totalPages: parseInt(headers["x-wp-totalpages"] as string, 10),
  };
};
