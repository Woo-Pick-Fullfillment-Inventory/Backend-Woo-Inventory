import { Type } from "@sinclair/typebox";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { performance } from "perf_hooks";

import {
  fetchAllProducts,
  firestoreMock,
} from "../../helpers/index.js";
import { createBasicAuthHeaderToken } from "../../modules/create-basic-auth-header.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { measureTime } from "../../modules/create-measure-timer.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";
import { createVerifyBasicAuthHeaderToken } from "../../modules/create-verify-authorization-header.js";
import {
  batchWriteProducts,
  getUserById,
  updateUserProductsSynced,
} from "../../repository/firestore/index.js";
import { getProductsPagination } from "../../repository/woo-api/create-get-products-pagination.js";

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

if (process.env["NODE_ENV"] === "test") await firestoreMock.syncProducts();
// TODO:
// 1. Add tracing
// 2. Add error handling
// 3. Add tests
// 4. Cloud functions?
export const syncProducts = async (req: Request, res: Response) => {

  const isSyncProductsRequestTypeValid = isResponseTypeTrue(SyncProductsSchema, req.body, false);
  if (!isSyncProductsRequestTypeValid.isValid) {
    logger.log("warn", `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** invalid sync products request type  ${isSyncProductsRequestTypeValid.errors[0]?.message} **Expected** ${JSON.stringify(SyncProductsSchema)} **RECEIVED** ${JSON.stringify(req.body)}`);
    return createErrorResponse(res, SERVICE_ERRORS.invalidRequestType);
  }

  const userId = createVerifyBasicAuthHeaderToken(req.headers["authorization"]);
  if (!userId) {
    logger.log("warn", `${req.method} ${req.url} - 401 - Not Authorized ***ERROR*** no decoded token from ${userId} header`);
    return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
  }

  const userFoundInFirestore = await getUserById(userId);
  if (!userFoundInFirestore) {
    logger.log("warn", `${req.method} ${req.url} - 404 - Not Found ***ERROR*** user not found by id ${userId}`);
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  if (userFoundInFirestore.are_products_synced) {
    logger.log("warn", `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** user ${userId} has already synced products`);
    return createErrorResponse(res, SERVICE_ERRORS.dataSyncedAlready);
  }

  const wooBasicAuth = createBasicAuthHeaderToken(userFoundInFirestore.woo_credentials.token, userFoundInFirestore.woo_credentials.secret);

  const base_url =
  process.env["NODE_ENV"] === "production" ? userFoundInFirestore.store.app_url : process.env["WOO_BASE_URL"] as string;

  const { totalItems } = await getProductsPagination(base_url, wooBasicAuth, 1, 1);

  const startTimeGettingProducts = performance.now();
  const products = await fetchAllProducts(base_url, wooBasicAuth, totalItems);
  if (products.length !== totalItems) {
    logger.log("error", `${req.method} ${req.url} - 500 - Internal Server Error ***ERROR*** Products Syncing failed`);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
  const endTimeGettingProducts = performance.now();
  logger.log("info", `Total time taken to get products from WooCommerce: ${measureTime(startTimeGettingProducts, endTimeGettingProducts)} milliseconds`);

  // what if internet connection is lost?
  const startTimeWritingToDb = performance.now();
  for (let i = 0; i < products.length; i+=100) {
    await batchWriteProducts(products.slice(i, i+100), userId);
  }
  const endTimeWritingToDb = performance.now();
  logger.log("info", `Total time taken to write data into DB: ${measureTime(startTimeWritingToDb, endTimeWritingToDb)} milliseconds`);

  await updateUserProductsSynced(userId);

  return res.status(200).send({ are_products_synced: true });
};
