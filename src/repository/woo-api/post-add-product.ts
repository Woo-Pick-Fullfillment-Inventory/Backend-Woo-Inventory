import { response } from "express";

import { convertWooProductToClient } from "./converter/convert-woo-product-to-client.js";
import { ProductSchema } from "./models/products.type.js";
import createAxiosClient from "../../modules/create-axios-client.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";

import type {
  ProductFromWooType,
  ProductType,
} from "./models/products.type.js";
import type {
  AxiosError,
  AxiosResponse,
} from "axios";

type UserInputAddProductType = {
  name: string,
  sku: string,
  price: string,
  stock_quantity: string,
  images: {
    id: number;
    src: string;
  }[];
};

export const postAddProductFactory = async (
  baseUrl: string,
  token: string,
  productDetails: UserInputAddProductType,
): Promise<ProductType> => {
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
          if (response.status !== 201) {
            logger.log(
              "error",
              `onTrue Intercepted: request ${response.config.url} with status code ${response.status} is not expected`,
            );
            throw new Error("Response not expected");
          }
          if (!isResponseTypeTrue(ProductSchema, response.data, true).isValid) {
            logger.log(
              "error",
              `onTrue Intercepted: request ${response.config.url} with ${response.data} does not return expected system status type`+
              ` ***Expected*** ${JSON.stringify(ProductSchema)} ***Received*** ${JSON.stringify(response.data)}`,
            );
            throw new Error("Response not expected");
          }
          return response;
        },
        onError: (error: AxiosError) => {
          if (error.config) {
            logger.log(
              "error",
              `onError Intercepted: request ${error.config.url} with response status ${response.status}:`,
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

  return convertWooProductToClient(data);
};
