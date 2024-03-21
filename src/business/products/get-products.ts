import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { createBasicAuthHeaderToken } from "../../modules/create-basic-auth-header.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { createVerifyBasicAuthHeaderToken } from "../../modules/create-verify-authorization-header.js";
import {
  getUserByAttribute,
  insertUser,
  viewCollection,
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

if (process.env["NODE_ENV"]==="test") insertUser({
  user_id: "1",
  email: "someone@gmail.com",
  username: "someone",
  password: "$2b$10$0ZS4yQgQbOTtm7ZajoMumejFapHqyVTOOWcT7v8cONhFFG9x8dwYe",
  store: { app_url: "https://testwebsite.com" },
  woo_credentials: {
    token: "ck_d7d08fe1607a38d72ac7566143a62c971c8c9a29",
    secret: "cs_0843d7cdeb3bccc539e7ec2452c1be9520098cfb",
  },
  authentication: {
    method: "woo_credentials",
    is_authorized: true,
  },
  last_login: "2024-02-06T00:00:00.000Z",
  are_products_synced: false,
});

export const getProducts = async (req: Request, res: Response) => {

  const perPage = typeof req.query["per_page"] === "string" ? parseInt(req.query["per_page"], 10) : undefined;
  const page = typeof req.query["page"] === "string" ? parseInt(req.query["page"], 10) : undefined;
  if (!perPage || !page) {
    logger.log("warn", `query per_page ${JSON.stringify(req.query["per_page"])} or page ${JSON.stringify(req.query["page"])} parameter is missing or invalid`);
    return createErrorResponse(res, SERVICE_ERRORS.notAllowed);
  }

  const userId = createVerifyBasicAuthHeaderToken(req.headers["authorization"]);
  if (!userId) {
    logger.log("warn", `${req.method} ${req.url} - 400 - Not Authorized ***ERROR*** no decoded token from ${JSON.stringify(req.headers["authorization"])} authorization header`);
    return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
  }

  console.log("userId", userId);

  const users = await viewCollection("users");
  console.log("users in fucking get products", users);

  const userFoundInFirestore = await getUserByAttribute("user_id", userId);
  if (!userFoundInFirestore) {
    logger.log("warn", `${req.method} ${req.url} - 404 - Not Found ***ERROR*** user not found by id ${userId}`);
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  const wooBasicAuth = createBasicAuthHeaderToken(userFoundInFirestore.woo_credentials.token, userFoundInFirestore.woo_credentials.secret);

  const base_url =
  process.env["NODE_ENV"] === "production" ? userFoundInFirestore.store.app_url : process.env["WOO_BASE_URL"] as string;

  const productsResult = await getProductsPagination(base_url, wooBasicAuth, perPage, page);

  return res.status(200).send({
    total_items: productsResult.totalItems,
    total_pages: productsResult.totalPages,
    items_count: productsResult.products.length,
    products: productsResult.products.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock_quantity: product.stock_quantity,
      image_src: product.images[0] ? product.images[0].src : "",
    })),
    has_next_page: productsResult.totalPages >= page,
  });
};
