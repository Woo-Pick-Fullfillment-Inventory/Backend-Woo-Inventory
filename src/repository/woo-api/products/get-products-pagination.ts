import { ERRORS } from "../../../constants/error.constant.js";
import createAxiosClient from "../../../modules/axios/create-axios-client.js";
import {
  axiosOnFulfillmentErrorLogger,
  axiosOnRejectedErrorLogger,
} from "../../../modules/axios/create-axios-error-logger-mappings.js";
import {
  type ProductWooType,
  ProductsWooSchema,
  type ProductsWooType,
} from "../index.js";

type getAllProductsPaginationResponse = {
  products: ProductWooType[];
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
  const { get } = createAxiosClient<ProductsWooType>({
    config: {
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    interceptors: [
      {
        onFulfillment: axiosOnFulfillmentErrorLogger({
          expectedStatusCode: 200,
          expectedSchema: ProductsWooSchema,
        }),
        onRejected: axiosOnRejectedErrorLogger,
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
    throw new Error(ERRORS.INVALID_RESPONSE_HEADERS);
  }

  return {
    products: data,
    totalItems: parseInt(headers["x-wp-total"] as string, 10),
    totalPages: parseInt(headers["x-wp-totalpages"] as string, 10),
  };
};
