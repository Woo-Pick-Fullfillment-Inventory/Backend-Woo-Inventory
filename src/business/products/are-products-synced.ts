import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { verifyAuthorizationHeader } from "../../modules/create-verify-authorization-header.js";
import { mongoRepository } from "../../repository/mongo/index.js";

import type {
  Request,
  Response,
} from "express";
dotenv.config();

const SERVICE_ERRORS = {
  notAuthorized: {
    statusCode: StatusCodes.UNAUTHORIZED,
    type: "/products/synced/not-authorized",
    message: "not authorized",
  },
  resourceNotFound: {
    statusCode: StatusCodes.NOT_FOUND,
    type: "/products/synced/not-found",
    message: "resource not found",
  },
};

export const areProductsSynced = async (req: Request, res: Response) => {
  const userId = verifyAuthorizationHeader(req.headers["authorization"]);
  if (!userId) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 401 - Not Authorized ***ERROR*** no decoded token from ${JSON.stringify(req.headers["authorization"])} authorization header`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
  }

  const userFoundInMongo =
    await mongoRepository.user.getUserById(userId);
  if (!userFoundInMongo) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 404 - Not Found ***ERROR*** user not found by id ${userId}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  return res
    .status(200)
    .send({ are_products_synced: userFoundInMongo.sync.are_products_synced });
};
