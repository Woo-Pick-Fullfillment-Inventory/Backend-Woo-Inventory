import { Type } from "@sinclair/typebox";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";
import { createVerifyBasicAuthHeaderToken } from "../../modules/create-verify-authorization-header.js";
import {
  getProducts,
  getUserById,
} from "../../repository/firestore/index.js";

import type {
  Request,
  Response,
} from "express";
dotenv.config();

const SERVICE_ERRORS = {
  notAuthorized: {
    statusCode: StatusCodes.UNAUTHORIZED,
    type: "/products/not-authorized",
    message: "not authorized",
  },
  resourceNotFound: {
    statusCode: StatusCodes.NOT_FOUND,
    type: "/products/not-found",
    message: "resource not found",
  },
  notAllowed: {
    statusCode: StatusCodes.FORBIDDEN,
    type: "/products/not-allowed",
    message: "query missing or not allowed",
  },
  invalidRequestType: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/products/request-failed",
    message: "invalid request",
  },
};

const sortingCriteria = Type.Object({
  field: Type.Union([
    Type.Literal("id"),
    Type.Literal("name"),
    Type.Literal("price"),
    Type.Literal("sku"),
    Type.Literal("stock_quantity"),
  ]),
  direction: Type.Union([
    Type.Literal("asc"),
    Type.Literal("desc"),
  ]),
});

const paginationCriteria = Type.Object({
  last_product: Type.Optional(Type.Number()),
  limit: Type.Number(),
});

const postGetProductsRequest = Type.Object({
  sortingCriteria: sortingCriteria,
  paginationCriteria: paginationCriteria,
});

export const postGetProducts = async (req: Request, res: Response) => {
  const isPostGetProductsRequestTypeValid = isResponseTypeTrue(
    postGetProductsRequest,
    req.body,
    false,
  );
  if (!isPostGetProductsRequestTypeValid.isValid) {
    logger.log(
      "warn",
      `${req.method} ${
        req.url
      } - 400 - Bad Request ***ERROR*** invalid post get products request type  ${
        isPostGetProductsRequestTypeValid.errorMessage
      } **Expected** ${JSON.stringify(
        postGetProductsRequest,
      )} **RECEIVED** ${JSON.stringify(req.body)}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.invalidRequestType);
  }

  const userId = createVerifyBasicAuthHeaderToken(req.headers["authorization"]);
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

  const userFoundInFirestore = await getUserById(userId);
  if (!userFoundInFirestore) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 404 - Not Found ***ERROR*** user not found by id ${userId}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  const products = await getProducts({
    userId,
    field: req.body.sortingCriteria.field,
    direction: req.body.sortingCriteria.direction,
    limit: req.body.paginationCriteria.limit,
  })(req.body.paginationCriteria.last_product);

  return res.status(200).send({
    ...products,
    last_product_id: products.lastProduct,
    total_products: products.products.length,
  });
};
