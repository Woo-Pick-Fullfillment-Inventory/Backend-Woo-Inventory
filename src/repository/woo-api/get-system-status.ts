import { Type } from "@sinclair/typebox";

import createAxiosClient from "../../modules/create-axios-client.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-check.js";

import type { Static } from "@sinclair/typebox";
import type {
  AxiosError,
  AxiosResponse,
} from "axios";

const SystemStatus = Type.Object({
  environment: Type.Object({
    home_url: Type.String(),
    site_url: Type.String(),
    version: Type.String(),
  }),
});

type SystemStatusType = Static<typeof SystemStatus>;

export const getSystemStatus = async (baseUrl: string, token: string): Promise<SystemStatusType | undefined> => {
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
            logger.log("error", `onTrue Intercepted: request ${response.config.url} with status code ${response.status} is not expected`);
            throw new Error("Response not expected");
          }
          if (!isResponseTypeTrue<SystemStatusType>(response.data)) {
            logger.log("error", `onTrue Intercepted: request ${response.config.url} with ${response.data} does not return expected system status type`);
            throw new Error("Response not expected");
          }
          return response;
        },
        onError: (error: AxiosError) => {
          if (error.config) {
            logger.log("error", `onError Intercepted: request ${error.config.url}:`, error);
          }
          return error;
        },
      },
    ],
  });
  const { data } = await get("/wp-json/wc/v3/system_status", { headers: { Authorization: token } });
  return data;
};