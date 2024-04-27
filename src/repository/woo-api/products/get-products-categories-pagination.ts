import { ERRORS } from "../../../constants/error.js";
import createAxiosClient from "../../../modules/axios/create-axios-client.js";
import {
  axiosOnFulfillmentErrorLogger,
  axiosOnRejectedErrorLogger,
} from "../../../modules/axios/create-axios-error-logger-mappings.js";
import {
  ProductsCategoriesWooSchema,
  type ProductsCategoriesWooType,
} from "../index.js";

type getAllProductsPaginationResponse = {
  categories: ProductsCategoriesWooType;
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
  const { get } = createAxiosClient<ProductsCategoriesWooType>({
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
          expectedSchema: ProductsCategoriesWooSchema,
        }),
        onRejected: axiosOnRejectedErrorLogger,
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
    throw new Error(ERRORS.INVALID_RESPONSE_HEADERS);
  }

  return {
    categories: data,
    totalItems: parseInt(headers["x-wp-total"] as string, 10),
    totalPages: parseInt(headers["x-wp-totalpages"] as string, 10),
  };
};
