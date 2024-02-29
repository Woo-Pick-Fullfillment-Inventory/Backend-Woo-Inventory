import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { createBasicAuthHeaderToken } from "../../modules/create-basic-auth-header.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { createVerifyBasicAuthHeaderToken } from "../../modules/create-verify-authorization-header.js";
import { getUserByAttribute } from "../../repository/firestore/index.js";
import { getAllProductsPagination } from "../../repository/woo-api/create-get-all-products-pagination.js";

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
};

export const getProducts = async (req: Request, res: Response) => {

  const perPage = typeof req.query["per_page"] === "string" ? parseInt(req.query["per_page"], 10) : undefined;
  const page = typeof req.query["page"] === "string" ? parseInt(req.query["page"], 10) : undefined;
  if (!perPage || !page) {
    logger.log("error", "query per_page or page parameter is missing or invalid");
    return createErrorResponse(res, SERVICE_ERRORS.notAllowed);
  }

  const headers = req.headers["authorization"];
  if (!headers) {
    logger.log("error", "no authorization header");
    return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
  }

  const userId = createVerifyBasicAuthHeaderToken(headers);
  if (!userId) {
    logger.log("error", `no decoded token from ${userId} header`);
    return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
  }

  const userFoundInFirestore = await getUserByAttribute("user_id", userId);
  if (!userFoundInFirestore) {
    logger.log("error", `user not found by id ${userId}`);
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  const wooBasicAuth = createBasicAuthHeaderToken(userFoundInFirestore.woo_credentials.token, userFoundInFirestore.woo_credentials.secret);

  const base_url =
  process.env["NODE_ENV"] === "production" ? userFoundInFirestore.store.app_url : process.env["WOO_BASE_URL"] as string;

  const products = await getAllProductsPagination(base_url, wooBasicAuth, perPage, page);

  if (!products || products.length === 0) {
    logger.log("error", `no products found by user ${userId}`);
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  return res.status(200).send({
    itemsCount: products.length,
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock_quantity: product.stock_quantity,
      imageSrc: product.images.length > 0 ? product.images[0]?.src : "",
    })),
  });
};
