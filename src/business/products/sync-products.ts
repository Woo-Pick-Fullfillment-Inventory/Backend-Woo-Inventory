import { Type } from "@sinclair/typebox";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";
import { createVerifyBasicAuthHeaderToken } from "../../modules/create-verify-authorization-header.js";
import {
  batchWriteProducts,
  getUserByAttribute,
  updateUserProductsSynced,
} from "../../repository/firestore/index.js";
import { getProductsPagination } from "../../repository/woo-api/create-get-products-pagination.js";

import type { ProductType } from "../../repository/woo-api/models/products.type.js";
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
};

const SyncProductsSchema = Type.Object({ action: Type.Union([ Type.Literal("sync-products") ]) });

export const syncProducts = async (req: Request, res: Response) => {
  let currentPage = 1;
  let allProductsToBeSynced: ProductType[] = [];
  let shouldContinue = true;

  const isSyncProductsRequestTypeValid = isResponseTypeTrue(SyncProductsSchema, req.body, false);
  if (!isSyncProductsRequestTypeValid.isValid) {
    logger.log("error", `invalid sync products request type  ${isSyncProductsRequestTypeValid.errors[0]?.message} **Expected** ${JSON.stringify(SyncProductsSchema)} **RECEIVED** ${JSON.stringify(req.body)}`);
    return createErrorResponse(res, SERVICE_ERRORS.invalidRequestType);
  }

  const userId = createVerifyBasicAuthHeaderToken(req.headers["authorization"]);
  if (!userId) {
    logger.log("error", `no decoded token from ${userId} header`);
    return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
  }

  const userFoundInFirestore = await getUserByAttribute("user_id", userId);
  if (!userFoundInFirestore) {
    logger.log("error", `user not found by id ${userId}`);
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  while (shouldContinue) {
    const result = await getProductsPagination(userFoundInFirestore.store.app_url, userFoundInFirestore.woo_credentials.token, 100, currentPage);
    if (result.products.length === 0) {
      shouldContinue = false;
      break;
    }
    allProductsToBeSynced = allProductsToBeSynced.concat(result.products);
    currentPage += 1;
  }

  for (let i = 0; i < allProductsToBeSynced.length; i+=100) {
    await batchWriteProducts(allProductsToBeSynced.slice(i, i+100), userId);
  }

  await updateUserProductsSynced(userId);

  return res.status(200).send({ are_products_synced: true });
};
