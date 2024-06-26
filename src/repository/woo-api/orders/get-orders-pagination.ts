import { WooHeaderError } from "../../../constants/error/header-error.constant.js";
import createAxiosClient from "../../../modules/axios/create-axios-client.js";
import {
  axiosOnFulfillmentErrorLogger,
  axiosOnRejectedErrorLogger,
} from "../../../modules/axios/create-axios-woo-error-logger-mappings.js";
import {
  OrdersWooSchema,
  type OrdersWooType,
} from "../models/order.type.js";

type getAllOrdersPaginationResponse = {
    orders: OrdersWooType;
    totalItems: number;
    totalPages: number;
};

// TODO: remove hardcode the after 2023-12-31T00:00:00
// TODO: remove hardcode the status pending,processing,on-hold
export const getOrdersPaginationFactory = async ({
  baseUrl,
  token,
  perPage,
  page,
  dateAfter,
  status,
}: {
    baseUrl: string;
    token: string;
    perPage: number;
    page: number;
    dateAfter: string;
    status: string[];
}): Promise<getAllOrdersPaginationResponse> => {
  const { get } = createAxiosClient<OrdersWooType>({
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
          expectedSchema: OrdersWooSchema,
        }),
        onRejected: axiosOnRejectedErrorLogger,
      },
    ],
  });

  const {
    data,
    headers,
  } = await get(
    `/wp-json/wc/v3/orders?per_page=${perPage}&page=${page}&after=${dateAfter}&status=${status.join(",")}`,
    { headers: { Authorization: token } },
  );

  if (
    headers["x-wp-total"] === undefined ||
    headers["x-wp-totalpages"] === undefined
  ) {
    throw new WooHeaderError();
  }

  return {
    orders: data,
    totalItems: parseInt(headers["x-wp-total"] as string, 10),
    totalPages: parseInt(headers["x-wp-totalpages"] as string, 10),
  };
};