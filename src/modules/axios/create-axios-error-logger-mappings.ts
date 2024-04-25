import { ERRORS } from "../../constants/error.js";
import logger from "../create-logger.js";
import { isResponseTypeTrue } from "../create-response-type-guard.js";

import type {
  AxiosError,
  AxiosResponse,
} from "axios";

export const axiosOnRejectedErrorLogger: (
  error: AxiosError
) => Promise<AxiosError> = (error: AxiosError) => Promise.reject(error);

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
      throw new Error(ERRORS.INVALID_RESPONSE_STATUS);
    }
    const isResponseValid = isResponseTypeTrue(expectedSchema, response.data, true);
    if (!isResponseValid.isValid) {
      logger.log(
        "error",
        `onFulfillment Intercepted: request ${response.config.url} returned unexpected data type. ` +
          `Expected: ${JSON.stringify(expectedSchema)}, Received: ${JSON.stringify(response.data)}`,
      );
      throw new Error(ERRORS.INVALID_REPOSNE_TYPE);
    }
    return response;
  };
};