import { StatusCodes } from "http-status-codes";

import APIResponseError from "./api-response-error.constant.js";

export const ERROR_TYPES = { MONGO_ERROR: "Database Error" } as const;

class MongoDataNotModifiedError extends APIResponseError{
  constructor(
    message = "Data not modified",
    type = ERROR_TYPES.MONGO_ERROR,
    statusCode = StatusCodes.NOT_MODIFIED,
  ) {
    super(message, type, statusCode);
  }
}

class MongoDataNotFoundError extends APIResponseError{
  constructor(
    message = "Data not found",
    type = ERROR_TYPES.MONGO_ERROR,
    statusCode = StatusCodes.NOT_FOUND,
  ) {
    super(message, type, statusCode);
  }
}

class MongoDataConflictError extends APIResponseError{
  constructor(
    message = "Data conflict",
    type = ERROR_TYPES.MONGO_ERROR,
    statusCode = StatusCodes.CONFLICT,
  ) {
    super(message, type, statusCode);
  }
}

class MongoBatchSizeExceededError extends APIResponseError{
  constructor(
    message = "Data to be inserted exceeds the maximum batch size allowed",
    type = ERROR_TYPES.MONGO_ERROR,
    statusCode = StatusCodes.BAD_REQUEST,
  ) {
    super(message, type, statusCode);
  }
}

class MongoDataWriteError extends APIResponseError{
  constructor(
    message = "Data write error",
    type = ERROR_TYPES.MONGO_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, type, statusCode);
  }
}

export {
  MongoBatchSizeExceededError,
  MongoDataNotModifiedError,
  MongoDataConflictError,
  MongoDataNotFoundError,
  MongoDataWriteError,
};