import { Type } from "@sinclair/typebox";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { performance } from "perf_hooks";

import { PRODUCT_PER_PAGE } from "../../constants/size.constant.js";
import { createBasicAuthHeaderToken } from "../../modules/create-basic-auth-header.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import fetchAllDataFromWoo from "../../modules/create-fetch-data-from-woo-batch.js";
import logger from "../../modules/create-logger.js";
import { measureTime } from "../../modules/create-measure-timer.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";
import { verifyAuthorizationHeader } from "../../modules/create-verify-authorization-header.js";
import { writeDataToMongoBatch } from "../../modules/create-write-data-to-mongo-batch.js";
import { mongoRepository } from "../../repository/mongo/index.js";
import {
  type ProductWooType,
  wooApiRepository,
} from "../../repository/woo-api/index.js";

import type {
  Request,
  Response,
} from "express";

dotenv.config();

const SERVICE_ERRORS = {
  notAuthorized: {
    statusCode: StatusCodes.UNAUTHORIZED,
    type: "/products/sync-process/not-authorized",
    message: "not authorized",
  },
  resourceNotFound: {
    statusCode: StatusCodes.NOT_FOUND,
    type: "/products/sync-process/not-found",
    message: "resource not found",
  },
  invalidRequestType: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/products/sync-process/invalid-request-type",
    message: "invalid request",
  },
  dataSyncedAlready: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/products/sync-process/synced-already",
    message: "products synced",
  },
};

const SyncProductsSchema = Type.Object({ action: Type.Union([ Type.Literal("sync-products") ]) });

// TODO:
// 1. Add tracing
// 2. Add error handling
// 3. Add tests
// 4. Cloud functions?
export const syncProducts = async (req: Request, res: Response) => {
  const isSyncProductsRequestTypeValid = isResponseTypeTrue(
    SyncProductsSchema,
    req.body,
    false,
  );
  if (!isSyncProductsRequestTypeValid.isValid) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** invalid sync products request type  ${isSyncProductsRequestTypeValid.errorMessage} **Expected** ${JSON.stringify(SyncProductsSchema)} **RECEIVED** ${JSON.stringify(req.body)}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.invalidRequestType);
  }

  const {
    user_id: userId,
    shop_type: shopType,
  } = verifyAuthorizationHeader(req.headers["authorization"]);
  if (!userId) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 401 - Not Authorized ***ERROR*** no decoded token from ${userId} header`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
  }

  const userFoundInMongo =
    await mongoRepository.user.getUserById(userId, shopType);
  if (!userFoundInMongo) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 404 - Not Found ***ERROR*** user not found by id ${userId}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  if (userFoundInMongo.sync.are_products_synced) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** user ${userId} has already synced products`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.dataSyncedAlready);
  }

  const documentCounts = await mongoRepository.collection.countDocuments({
    userId,
    shop: userFoundInMongo.store.type,
    collectionName: "products",
  });
  if (documentCounts > 0) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** user ${userId} has already synced ${documentCounts} products`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.dataSyncedAlready);
  }

  const wooBasicAuth = createBasicAuthHeaderToken(
    userFoundInMongo.woo_credentials.token,
    userFoundInMongo.woo_credentials.secret,
  );

  const baseUrl =
    process.env["NODE_ENV"] === "production"
      ? userFoundInMongo.store.app_url
      : (process.env["WOO_BASE_URL"] as string);

  const { totalItems } = await wooApiRepository.product.getProductsPagination({
    baseUrl: baseUrl,
    token: wooBasicAuth,
    perPage: 1,
    page: 1,
  });

  const startTimeGettingProducts = performance.now();
  const productsFromWoo = await fetchAllDataFromWoo<ProductWooType>({
    baseUrl,
    wooBasicAuth,
    totalItems,
    endpoint: "products",
    perPage: PRODUCT_PER_PAGE,
  });
  logger.log(
    "info",
    `Total products fetched from WooCommerce: ${productsFromWoo.length}/${totalItems}`,
  );
  if (productsFromWoo.length !== totalItems) {
    logger.log(
      "error",
      `${req.method} ${req.url} - 500 - Internal Server Error ***ERROR*** Products Syncing failed. expected ${totalItems} but got ${productsFromWoo.length} products.`,
    );
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const endTimeGettingProducts = performance.now();
  logger.log(
    "info",
    `Total time taken to get products from WooCommerce: ${measureTime(startTimeGettingProducts, endTimeGettingProducts)} milliseconds`,
  );

  // what if internet connection is lost?
  const startTimeWritingToDb = performance.now();
  const productsCount = await writeDataToMongoBatch({
    data: productsFromWoo,
    userId,
    shop: userFoundInMongo.store.type,
    caseType: "products",
  });
  const endTimeWritingToDb = performance.now();
  logger.log(
    "info",
    `Total time taken to write data into DB: ${measureTime(startTimeWritingToDb, endTimeWritingToDb)} milliseconds`,
  );

  if (productsCount !== productsFromWoo.length) {
    logger.log(
      "error",
      `${req.method} ${req.url} - 500 - Internal Server Error ***ERROR*** Products Syncing failed. expected ${productsFromWoo.length} but got ${productsCount} products.`,
    );
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  await mongoRepository.user.updateUserProductsSynced(userId, true, userFoundInMongo.store.type);

  return res.sendStatus(201);
};
