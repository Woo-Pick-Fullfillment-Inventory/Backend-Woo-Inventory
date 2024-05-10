import { StatusCodes } from "http-status-codes";

import APIResponseError from "./api-response-error.constant.js";

const ERROR_TYPES = {
  AXIOS_ERROR: "Axios Error",
  API_HEADER_ERROR: "API Header Error",
} as const;

class WooHeaderError extends APIResponseError{
  constructor(
    message = "Woo header error",
    type = ERROR_TYPES.AXIOS_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, type, statusCode);
  }
}

class NoAuthorizedHeader extends APIResponseError{
  constructor(
    message = "API header error",
    type = ERROR_TYPES.API_HEADER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, type, statusCode);
  }
}

class TokenNotFoundInHeaderError extends APIResponseError{
  constructor(
    message = "Token not found in header",
    type = ERROR_TYPES.API_HEADER_ERROR,
    statusCode = StatusCodes.UNAUTHORIZED,
  ) {
    super(message, type, statusCode);
  }
}

export {
  WooHeaderError,
  NoAuthorizedHeader,
  TokenNotFoundInHeaderError,
};
