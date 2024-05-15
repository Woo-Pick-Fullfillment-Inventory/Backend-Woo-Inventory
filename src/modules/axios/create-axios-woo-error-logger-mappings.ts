import {
  InvalidAxiosReponseError,
  InvalidAxiosStatusError,
  WooBadRequestError,
  WooInternalErrorError,
  WooNotFoundError,
  WooUnauthorizedError,
} from "../../constants/error/woo-error.constant.js";
import logger from "../create-logger.js";
import { isResponseTypeValid } from "../create-response-type-guard.js";

import type {
  AxiosError,
  AxiosResponse,
} from "axios";

export const axiosOnRejectedErrorLogger: (
  error: AxiosError
) => Promise<AxiosError> = (error: AxiosError) => {
  error.response && logger.log(
    "error",
    `onRejected Intercepted: request ${error.config?.url} failed with status code ${error.response?.status}`,
  );
  if (error.response?.status === 500) {
    throw new WooInternalErrorError();
  }
  if (error.response?.status === 401) {
    throw new WooUnauthorizedError();
  }
  if (error.response?.status === 404) {
    throw new WooNotFoundError();
  }
  if (error.response?.status === 400) {
    throw new WooBadRequestError();
  }

  return Promise.reject(error);
};

export const axiosOnFulfillmentErrorLogger = ({
  expectedStatusCode,
  expectedSchema,
}: {
  expectedStatusCode: number;
  // eslint-disable-next-line
  expectedSchema: any;
}) => {
  return (response: AxiosResponse) => {
    if (response.status !== expectedStatusCode) {
      logger.log(
        "error",
        `onFulfillment Intercepted: request ${response.config.url} with status code ${response.status} is not expected`,
      );
      throw new InvalidAxiosStatusError();
    }
    const isResponseValid = isResponseTypeValid(
      expectedSchema,
      response.data,
      true,
    );
    if (!isResponseValid.isValid) {
      logger.log(
        "error",
        `onFulfillment Intercepted: request ${response.config.url} returned unexpected data type. ` +
          `Expected: ${JSON.stringify(expectedSchema)}, Received: ${JSON.stringify(response.data)}`,
      );
      throw new InvalidAxiosReponseError();
    }
    return response;
  };
};
