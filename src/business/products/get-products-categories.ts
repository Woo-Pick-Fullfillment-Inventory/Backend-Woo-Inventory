import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { ROOT_CATEGORY_PARENT_ID } from "../../constants/products-categories.js";
import { convertCategoriesToCLient } from "../../helpers/convert-categories.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { verifyAuthorizationHeader } from "../../modules/create-verify-authorization-header.js";
import { firestoreRepository } from "../../repository/firestore/index.js";

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
  dataNotSynced: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/products/categories/sync/synced-not-already",
    message: "products categories not synced",
  },
};

export const getProductsCategories = async (req: Request, res: Response) => {
  const userId = verifyAuthorizationHeader(req.headers["authorization"]);

  if (!userId) {
    logger.log(
      "error",
      `no decoded token from ${JSON.stringify(
        req.headers["authorization"],
      )} authorization header`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.notAllowed);
  }

  const userFoundInFirestore =
    await firestoreRepository.user.getUserById(userId);
  if (!userFoundInFirestore) {
    logger.log("error", `user not found by id ${userId}`);
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  if (userFoundInFirestore.sync.are_products_categories_synced) {
    logger.log("error", "products categories were not synced");
    return createErrorResponse(res, SERVICE_ERRORS.dataNotSynced);
  }

  const categories = await firestoreRepository.productCategory.getProductsCategories({ userId });

  return res.status(201).send(
    convertCategoriesToCLient({
      data: categories,
      parentId: ROOT_CATEGORY_PARENT_ID,
    }),
  );
};
