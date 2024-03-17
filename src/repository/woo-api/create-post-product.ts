import { convertWooProductToClient } from "./converter/convert-woo-product-to-client.js";
import { ProductsSchema } from "./models/products.type.js";
import createAxiosClient from "../../modules/create-axios-client.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";

import type {
  NewProductType,
  ProductFromWooType,
  ProductType,
} from "./models/products.type.js";
import type {
  AxiosError,
  AxiosResponse,
} from "axios";

type PostProductResponse = {
  product: ProductType; // Assuming ProductType is the type for a single product
};

export const postProducts = async (
  baseUrl: string,
  token: string,
  productDetails: NewProductType,
): Promise<PostProductResponse> => {
  const { post } = createAxiosClient<ProductFromWooType>({
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
              `onTrue Intercepted: request ${response.config.url} with status code ${response.status} is not expected`,
            );
            throw new Error("Response not expected");
          }
          if (!isResponseTypeTrue(ProductsSchema, response.data, true)) {
            logger.log(
              "error",
              `onTrue Intercepted: request ${response.config.url} with ${response.data} does not return expected system status type`,
            );
            throw new Error("Response not expected");
          }
          return response;
        },
        onError: (error: AxiosError) => {
          if (error.config) {
            logger.log(
              "error",
              `onError Intercepted: request ${error.config.url}:`,
              error,
            );
          }
          return error;
        },
      },
    ],
  });
  const { data } = await post(
    "/wp-json/wc/v3/products",
    productDetails,
    { headers: { Authorization: token } },
  );

  return { product: convertWooProductToClient(data) };
};
