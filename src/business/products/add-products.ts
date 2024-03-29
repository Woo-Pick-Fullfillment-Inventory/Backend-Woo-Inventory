import { Type } from "@sinclair/typebox";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { createBasicAuthHeaderToken } from "../../modules/create-basic-auth-header.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";
import { createVerifyBasicAuthHeaderToken } from "../../modules/create-verify-authorization-header.js";
import { firestoreRepository } from "../../repository/firestore/index.js";
import { postProduct } from "../../repository/woo-api/create-post-product.js";

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
    type: "/products/add-product-failed",
    message: "request body is not valid",
  },
};

const AddProductRequest = Type.Object({
  name: Type.String(),
  sku: Type.String(),
  price: Type.String(),
  stock_quantity: Type.Optional(Type.Number()),
  description: Type.Optional(Type.Union([
    Type.Null(),
    Type.String(),
  ])), // Example usage of the commented-out line
  images: Type.Array(Type.Object({ src: Type.String() })),
});

export const addProduct = async (req: Request, res: Response) => {
  const productDetails = req.body;
  const isAddProductTypeRequestValid = isResponseTypeTrue(
    AddProductRequest,
    req.body,
    false,
  );

  if (!isAddProductTypeRequestValid.isValid) {
    logger.log(
      "error",
      `invalid add product request type  ${
        isAddProductTypeRequestValid.errorMessage
      } **Expected** ${JSON.stringify(
        AddProductRequest,
      )} **RECEIVED** ${JSON.stringify(req.body)}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.invalidRequestType);
  }

  const userId = createVerifyBasicAuthHeaderToken(req.headers["authorization"]);

  if (!userId) {
    logger.log(
      "error",
      `no decoded token from ${JSON.stringify(
        req.headers["authorization"],
      )} authorization header`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.notAllowed);
  }

  const userFoundInFirestore = await firestoreRepository.user.getUserById(userId);
  if (!userFoundInFirestore) {
    logger.log("error", `user not found by id ${userId}`);
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  const wooBasicAuth = createBasicAuthHeaderToken(
    userFoundInFirestore.woo_credentials.token,
    userFoundInFirestore.woo_credentials.secret,
  );

  const base_url =
    process.env["NOVE_ENV"] === "product"
      ? userFoundInFirestore.store.app_url
      : (process.env["WOO_BASE_URL"] as string);

  try {
    const addProductToWooResult = await postProduct(
      base_url,
      wooBasicAuth,
      productDetails,
    );

    await firestoreRepository.product.insertProduct({
      id: addProductToWooResult.product.id,
      name: addProductToWooResult.product.name,
      sku: addProductToWooResult.product.sku,
      price: addProductToWooResult.product.price,
      stock_quantity: addProductToWooResult.product.stock_quantity,
      images: addProductToWooResult.product.images,
    }, userId);

    return res.status(201).send(addProductToWooResult);
  } catch (error) {
    throw new Error("Error adding product to woo and database");
  }
};
