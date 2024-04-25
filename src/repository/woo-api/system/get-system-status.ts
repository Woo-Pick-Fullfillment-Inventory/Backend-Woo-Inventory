import createAxiosClient from "../../../modules/axios/create-axios-client.js";
import {
  axiosOnFulfillmentErrorLogger,
  axiosOnRejectedErrorLogger,
} from "../../../modules/axios/create-axios-error-logger-mappings.js";
import {
  SystemStatusFromWooSchema,
  type SystemStatusFromWooType,
} from "../index.js";

export const getSystemStatusFactory = async ({
  baseUrl,
  token,
}: {
  baseUrl: string;
  token: string;
}): Promise<SystemStatusFromWooType> => {
  const { get } = createAxiosClient<SystemStatusFromWooType>({
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
          expectedSchema: SystemStatusFromWooSchema,
        }),
        onRejected: axiosOnRejectedErrorLogger,
      },
    ],
  });

  const { data } = await get("/wp-json/wc/v3/system_status", { headers: { Authorization: token } });
  return data;
};
