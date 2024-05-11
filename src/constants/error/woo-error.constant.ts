import { StatusCodes } from "http-status-codes";

import APIResponseError from "./api-response-error.constant.js";

export const ERROR_TYPES = { AXIOS_ERROR: "Axios Error" } as const;

class InvalidAxiosStatusError extends APIResponseError{
  constructor(
    message = "Invalid response status code",
    type = ERROR_TYPES.AXIOS_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, type, statusCode);
  }
}

class InvalidAxiosReponseError extends APIResponseError{
  constructor(
    message = "Invalid response data type",
    type = ERROR_TYPES.AXIOS_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, type, statusCode);
  }
}

class WooInternalErrorError extends APIResponseError{
  constructor(
    message = "Woo internal server error",
    type = ERROR_TYPES.AXIOS_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, type, statusCode);
  }
}

class WooUnauthorizedError extends APIResponseError{
  constructor(
    message = "Woo Authentication or permission error",
    type = ERROR_TYPES.AXIOS_ERROR,
    statusCode = StatusCodes.UNAUTHORIZED,
  ) {
    super(message, type, statusCode);
  }
}

class WooNotFoundError extends APIResponseError{
  constructor(
    message = "Woo resource not found",
    type = ERROR_TYPES.AXIOS_ERROR,
    statusCode = StatusCodes.NOT_FOUND,
  ) {
    super(message, type, statusCode);
  }
}

class WooBadRequestError extends APIResponseError{
  constructor(
    message = "Woo bad request",
    type = ERROR_TYPES.AXIOS_ERROR,
    statusCode = StatusCodes.BAD_REQUEST,
  ) {
    super(message, type, statusCode);
  }
}

export {
  InvalidAxiosStatusError,
  InvalidAxiosReponseError,
  WooInternalErrorError,
  WooUnauthorizedError,
  WooNotFoundError,
  WooBadRequestError,
};
