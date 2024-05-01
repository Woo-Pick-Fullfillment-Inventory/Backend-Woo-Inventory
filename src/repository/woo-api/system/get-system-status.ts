import createAxiosClient from "../../../modules/axios/create-axios-client.js";
import {
  axiosOnFulfillmentErrorLogger,
  axiosOnRejectedErrorLogger,
} from "../../../modules/axios/create-axios-error-logger-mappings.js";
import {
  SystemStatusWooSchema,
  type SystemStatusWooType,
} from "../index.js";

export const getSystemStatusFactory = async ({
  baseUrl,
  token,
}: {
  baseUrl: string;
  token: string;
}): Promise<SystemStatusWooType> => {
  const { get } = createAxiosClient<SystemStatusWooType>({
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
          expectedSchema: SystemStatusWooSchema,
        }),
        onRejected: axiosOnRejectedErrorLogger,
      },
    ],
  });

  const { data } = await get("/wp-json/wc/v3/system_status", { headers: { Authorization: token } });
  return data;
};
