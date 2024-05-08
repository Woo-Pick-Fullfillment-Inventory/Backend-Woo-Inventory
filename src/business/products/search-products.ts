import { Type } from "@sinclair/typebox";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";
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
  page: Type.Number(),
  per_page: Type.Number(),
});

const postGetProductsRequest = Type.Object({
  sorting_criteria: sortingCriteria,
  pagination_criteria: paginationCriteria,
});

export const searchProducts = async (req: Request, res: Response) => {
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

  const userFoundInMongo =
    await mongoRepository.user.getUserById(userId);
  if (!userFoundInMongo) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 404 - Not Found ***ERROR*** user not found by id ${userId}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  const mongoProductseResult = await mongoRepository.product.getProducts(
    userId,
    {
      attribute: req.body.sorting_criteria.field,
      direction: req.body.sorting_criteria.direction,
      page: req.body.pagination_criteria.page,
      per_page: req.body.pagination_criteria.per_page,
    },
  );

  return res.status(201).send({
    products: mongoProductseResult.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku ?? "N/A",
      stock_quantity: product.stock_quantity ?? "N/A",
      price: product.sale_price ?? "N/A",
      expiration_date: product.expiration_date ?? "N/A",
    })),
  });
};
