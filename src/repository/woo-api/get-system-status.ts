import {
  SystemStatusSchema,
  type SystemStatusType,
} from "./models/index.js";
import createAxiosClient from "../../modules/create-axios-client.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";

import type {
  AxiosError,
  AxiosResponse,
} from "axios";

export const getSystemStatus = async (
  baseUrl: string,
  token: string,
): Promise<SystemStatusType> => {
  const { get } = createAxiosClient<SystemStatusType>({
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
            throw new Error("Response status code not expected");
          }
          if (!isResponseTypeTrue(SystemStatusSchema, response.data, true)) {
            logger.log(
              "error",
              `onTrue Intercepted: request ${response.config.url} with ${response.data} does not return expected system status type`,
            );
            throw new Error("Response type not expected");
          }
          return response;
        },
        onError: (error: AxiosError) => {
          if (error.config) {
            logger.log(
              "error",
              `onError Intercepted: request ${
                error.config.url
              }, ${JSON.stringify(error)}`,
            );
            throw new Error("Axios error");
          }
          return error;
        },
      },
    ],
  });
  const { data } = await get("/wp-json/wc/v3/system_status", { headers: { Authorization: token } });
  return data;
};
