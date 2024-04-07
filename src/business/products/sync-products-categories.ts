import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import fetchAllProductsCategories from "../../helpers/fetch-products-categories-batch.js";
import { createBasicAuthHeaderToken } from "../../modules/create-basic-auth-header.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { measureTime } from "../../modules/create-measure-timer.js";
import { verifyAuthorizationHeader } from "../../modules/create-verify-authorization-header.js";
import { firestoreRepository } from "../../repository/firestore/index.js";
import { wooApiRepository } from "../../repository/woo-api/index.js";

import type {
  Request,
  Response,
} from "express";
dotenv.config();

const SERVICE_ERRORS = {
  notAuthorized: {
    statusCode: StatusCodes.UNAUTHORIZED,
    type: "/products/categories/sync/not-authorized",
    message: "not authorized",
  },
  resourceNotFound: {
    statusCode: StatusCodes.NOT_FOUND,
    type: "/products/categories/sync/not-found",
    message: "resource not found",
  },
  notAllowed: {
    statusCode: StatusCodes.FORBIDDEN,
    type: "/products/categories/sync/not-allowed",
    message: "query missing or not allowed",
  },
  invalidRequestType: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/products/categories/sync/request-failed",
    message: "invalid request",
  },
};

export const syncProductsCategories = async (req: Request, res: Response) => {

  const userId = verifyAuthorizationHeader(req.headers["authorization"]);
  if (!userId) {
    logger.log(
      "warn",
      `${req.method} ${
        req.url
      } - 400 - Not Authorized ***ERROR*** no decoded token from ${JSON.stringify(
        req.headers["authorization"],
      )} authorization header`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
  }

  const userFoundInFirestore =
    await firestoreRepository.user.getUserById(userId);
  if (!userFoundInFirestore) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 404 - Not Found ***ERROR*** user not found by id ${userId}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  const wooBasicAuth = createBasicAuthHeaderToken(
    userFoundInFirestore.woo_credentials.token,
    userFoundInFirestore.woo_credentials.secret,
  );

  const baseUrl =
      process.env["NODE_ENV"] === "production"
        ? userFoundInFirestore.store.app_url
        : (process.env["WOO_BASE_URL"] as string);

  const { totalItems } = await wooApiRepository.product.getProductsCategoriesPagination({
    baseUrl: baseUrl,
    token: wooBasicAuth,
    perPage: 1,
    page: 1,
  });

  const startTimeGettingProducts = performance.now();
  const categories = await fetchAllProductsCategories({
    baseUrl,
    wooBasicAuth,
    totalItems,
  });
  if (categories.length !== totalItems) {
    logger.log(
      "error",
      `${req.method} ${req.url} - 500 - Internal Server Error ***ERROR*** Products Categories Syncing failed`,
    );
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
  const endTimeGettingProducts = performance.now();
  logger.log(
    "info",
    `Total time taken to get products categories from WooCommerce: ${measureTime(startTimeGettingProducts, endTimeGettingProducts)} milliseconds`,
  );

  // what if internet connection is lost?
  const startTimeWritingToDb = performance.now();
  for (let i = 0; i < categories.length; i += 100) {
    await firestoreRepository.productCategory.batchWriteProductsCategories(
      categories.slice(i, i + 100),
      userId,
    );
  }
  const endTimeWritingToDb = performance.now();
  logger.log(
    "info",
    `Total time taken to write data into DB: ${measureTime(startTimeWritingToDb, endTimeWritingToDb)} milliseconds`,
  );

  await firestoreRepository.user.updateUserProductsSynced(userId, true);

  return res.status(200);
};
