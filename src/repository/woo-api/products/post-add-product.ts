import { response } from "express";

import createAxiosClient from "../../../modules/create-axios-client.js";
import logger from "../../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../../modules/create-response-type-guard.js";
import { convertWooProductToClient } from "../converter/convert-woo-product-to-client.js";
import { ProductSchema } from "../models/products.type.js";

import type {
  ProductFromWooType,
  ProductType,
} from "../models/products.type.js";
import type {
  AxiosError,
  AxiosResponse,
} from "axios";

type AddProductRequestFromUserType = {
  name: string;
  sku: string | undefined;
  categories: {
    id: string;
    name: string;
    slug: string;
  }[] | undefined;
  barcode: string | undefined;
  imei: string | undefined;
  supplier: string | undefined;
  purchase_price: string | undefined;
  regular_price: string | undefined;
  sale_price: string | undefined;
  tax_status: "taxable" | "shipping" | "none";
  tax_class: "standard" | "reduced rate" | "zero rate";
  unit: string | undefined;
  activate: boolean | undefined;
  images: {
    src: string;
  }[] | undefined;
}

export const postAddProductFactory = async (
  baseUrl: string,
  token: string,
  addProductRequestFromUser: AddProductRequestFromUserType,
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
    addProductRequestFromUser,
    { headers: { Authorization: token } },
  );

  return convertWooProductToClient(data);
};
