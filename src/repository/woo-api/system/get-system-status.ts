import createAxiosClient from "../../../modules/create-axios-client.js";
import logger from "../../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../../modules/create-response-type-guard.js";
import {
  SystemStatusSchema,
  type SystemStatusType,
} from "../models/index.js";

import type {
  AxiosError,
  AxiosResponse,
} from "axios";

export const getSystemStatusFactory = async (
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
          const isSystemStatusTypeValid = isResponseTypeTrue(
            SystemStatusSchema,
            response.data,
            true,
          );
          if (!isSystemStatusTypeValid.isValid) {
            logger.log(
              "error",
              `onTrue Intercepted: request ${response.config.url} response error ${isSystemStatusTypeValid.errorMessage}` +
                ` ***Expected*** ${JSON.stringify(SystemStatusSchema)} ***Received*** ${JSON.stringify(response.data)}`,
            );
            throw new Error("Response type not expected");
          }
          return response;
        },
        onError: (error: AxiosError) => {
          if (error.config) {
            logger.log(
              "error",
              `onError Intercepted: request ${error.config.url}, ${JSON.stringify(error)}`,
            );
          }
          throw new Error("Axios Error");
        },
      },
    ],
  });

  const { data } = await get("/wp-json/wc/v3/system_status", { headers: { Authorization: token } });
  return data;
};
