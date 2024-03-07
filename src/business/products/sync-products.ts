import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { createVerifyBasicAuthHeaderToken } from "../../modules/create-verify-authorization-header.js";
import { getUserByAttribute } from "../../repository/firestore/index.js";

import type {
  Request,
  Response,
} from "express";
import { getProductsPagination } from "../../repository/woo-api/create-get-products-pagination.js";
import type { ProductType } from "../../repository/woo-api/models/products.type.js";
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
};

export const syncProducts = async (req: Request, res: Response) => {
  let currentPage = 1;
  let allProductsToBeSynced: ProductType[] = [];

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

  while (true) {
    const result = await getProductsPagination(userFoundInFirestore.store.app_url, userFoundInFirestore.woo_credentials.token, 100, currentPage);
    if (result.products.length === 0) {
      break;
    }
    allProductsToBeSynced = allProductsToBeSynced.concat(result.products);
    currentPage += 1;
  }

  

  return res.status(200).send({ are_products_synced: userFoundInFirestore.are_products_synced });
};
