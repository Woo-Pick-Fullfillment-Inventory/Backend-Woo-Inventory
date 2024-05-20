import { Type } from "@sinclair/typebox";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { CATEGORIES_PER_PAGE } from "../../constants/size.constant.js";
import { findDuplicateIds } from "../../helpers/index.js";
import { createBasicAuthHeaderToken } from "../../modules/create-basic-auth-header.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import fetchAllDataFromWoo from "../../modules/create-fetch-data-from-woo-batch.js";
import logger from "../../modules/create-logger.js";
import { measureTime } from "../../modules/create-measure-timer.js";
import { isResponseTypeValid } from "../../modules/create-response-type-guard.js";
import { verifyAuthorizationHeader } from "../../modules/create-verify-authorization-header.js";
import { writeDataToMongoBatch } from "../../modules/create-write-data-to-mongo-batch.js";
import { mongoRepository } from "../../repository/mongo/index.js";
import {
  type ProductsCategoryWooType,
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
  dataSyncedAlready: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/products/categories/sync/synced-already",
    message: "products categories already synced",
  },
  dupplicateIdsFound: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/products/categories/sync/dupplicate-ids-found",
    message: "dupplicate ids found",
  },
};

const SyncProductsCategoriesSchema = Type.Object({ action: Type.Union([ Type.Literal("sync-products-categories") ]) });

export const syncProductsCategories = async (req: Request, res: Response) => {
  const isSyncProductsCategoriesRequestTypeValid = isResponseTypeValid(
    SyncProductsCategoriesSchema,
    req.body,
    false,
  );
  if (!isSyncProductsCategoriesRequestTypeValid.isValid) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** invalid sync products request type  ${isSyncProductsCategoriesRequestTypeValid.errorMessage} **Expected** ${JSON.stringify(SyncProductsCategoriesSchema)} **RECEIVED** ${JSON.stringify(req.body)}`,
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
      `${req.method} ${
        req.url
      } - 400 - Not Authorized ***ERROR*** no decoded token from ${JSON.stringify(
        req.headers["authorization"],
      )} authorization header`,
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

  if (userFoundInMongo.sync.are_products_categories_synced) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** products categories already synced`,
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

  const { totalItems } =
    await wooApiRepository.product.getProductsCategoriesPagination({
      baseUrl: baseUrl,
      token: wooBasicAuth,
      perPage: 1,
      page: 1,
    });

  const startTimeGettingProducts = performance.now();
  const categoriesFromWoo = await fetchAllDataFromWoo<ProductsCategoryWooType>({
    baseUrl,
    wooBasicAuth,
    totalItems,
    perPage: CATEGORIES_PER_PAGE,
    endpoint: "products-categories",
  });

  const dupplicateIdsFound = findDuplicateIds(categoriesFromWoo);
  if (dupplicateIdsFound.length > 0) {
    logger.log(
      "error",
      `${req.method} ${req.url} - Products Categories Syncing failed. dupplicate ids found ${dupplicateIdsFound.join(", ")}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.dupplicateIdsFound);
  }

  if (categoriesFromWoo.length !== totalItems) {
    logger.log(
      "error",
      `${req.method} ${req.url} - 500 - Internal Server Error ***ERROR*** Products Categories Syncing failed. Expected ${totalItems} but received ${categoriesFromWoo.length} products categories from WooCommerce.`,
    );
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
  const endTimeGettingProducts = performance.now();
  logger.log(
    "info",
    `Total time taken to get products categories from WooCommerce: ${measureTime(startTimeGettingProducts, endTimeGettingProducts)} milliseconds`,
  );

  // what if internet connection is lost?
  // todo: what if more than 1000 categories?
  const startTimeWritingToDb = performance.now();
  const categoriesCount = await writeDataToMongoBatch({
    data: categoriesFromWoo,
    userId,
    shop: shopType,
    caseType: "categories",
  });
  const endTimeWritingToDb = performance.now();
  logger.log(
    "info",
    `Total time taken to write data into DB: ${measureTime(startTimeWritingToDb, endTimeWritingToDb)} milliseconds`,
  );

  if (categoriesCount !== categoriesFromWoo.length) {
    logger.log(
      "error",
      `${req.method} ${req.url} - 500 - Internal Server Error ***ERROR*** Products Categories Syncing failed. Expected ${categoriesFromWoo.length} but received ${categoriesCount} products categories.`,
    );
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  await mongoRepository.user.updateUserProductsCategoriesSynced(
    userId,
    true,
    shopType,
  );

  return res.sendStatus(201);
};
