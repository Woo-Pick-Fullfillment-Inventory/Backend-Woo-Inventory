import { Type } from "@sinclair/typebox";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { createBasicAuthHeaderToken } from "../../modules/create-basic-auth-header.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeValid } from "../../modules/create-response-type-guard.js";
import { verifyAuthorizationHeader } from "../../modules/create-verify-authorization-header.js";
import { mongoRepository } from "../../repository/mongo/index.js";
import { wooApiRepository } from "../../repository/woo-api/index.js";

import type {
  Request,
  Response,
} from "express";

dotenv.config();

const SERVICE_ERRORS = {
  notAuthorized: {
    statusCode: StatusCodes.UNAUTHORIZED,
    type: "/products/add-product/not-authorized",
    message: "not authorized",
  },
  resourceNotFound: {
    statusCode: StatusCodes.NOT_FOUND,
    type: "/products/add-product/not-found",
    message: "resource not found",
  },
  notAllowed: {
    statusCode: StatusCodes.FORBIDDEN,
    type: "/products/add-product/not-allowed",
    message: "query missing or not allowed",
  },
  invalidRequestType: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/products/add-product/add-product-failed",
    message: "request body is not valid",
  },
  dataNotSynced: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/products/add-product/data-not-synced",
    message: "products must be synced first",
  },
};

const AddProductRequest = Type.Object({
  name: Type.String(),
  sku: Type.Optional(Type.String()),
  slug: Type.Optional(Type.String()),
  categories: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
        slug: Type.String(),
      }),
    ),
  ),
  barcode: Type.Optional(Type.String()),
  imei: Type.Optional(Type.String()),
  supplier: Type.Optional(Type.String()),
  purchase_price: Type.Optional(Type.String()),
  regular_price: Type.Optional(Type.String()),
  sale_price: Type.Optional(Type.String()),
  images: Type.Optional(Type.Array(Type.Object({ src: Type.String() }))),
  // TODO: Deeper research on this field
  tax_status: Type.Optional(
    Type.Union([
      Type.Literal("taxable"),
      Type.Literal("shipping"),
      Type.Literal("none"),
    ]),
  ),
  tax_class: Type.Optional(
    Type.Union([
      Type.Literal("standard"),
      Type.Literal("reduced-rate"),
      Type.Literal("zero-rate"),
    ]),
  ),
  unit: Type.Optional(Type.String()),
  activate: Type.Optional(Type.Boolean()),
});

export const addProduct = async (req: Request, res: Response) => {
  const isAddProductTypeRequestValid = isResponseTypeValid(
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

  const {
    user_id: userId,
    shop_type: shopType,
  } = verifyAuthorizationHeader(
    req.headers["authorization"],
  );

  if (!userId) {
    logger.log(
      "error",
      `no decoded token from ${JSON.stringify(
        req.headers["authorization"],
      )} authorization header`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.notAllowed);
  }

  const userFoundInMongo = await mongoRepository.user.getUserById(
    userId,
    shopType,
  );
  if (!userFoundInMongo) {
    logger.log("error", `user not found by id ${userId}`);
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  if (userFoundInMongo.sync.are_products_synced === false) {
    logger.log("error", `user ${userId} needs to sync products first`);
    return createErrorResponse(res, SERVICE_ERRORS.dataNotSynced);
  }

  const product = await wooApiRepository.product.postAddProduct({
    baseUrl:
      process.env["NODE_ENV"] === "production"
        ? userFoundInMongo.store.app_url
        : (process.env["WOO_BASE_URL"] as string),
    token: createBasicAuthHeaderToken(
      userFoundInMongo.woo_credentials.token,
      userFoundInMongo.woo_credentials.secret,
    ),
    addProductRequestFromUser: req.body,
  });

  await mongoRepository.product.insertProduct({
    userId,
    product: {
      id: product.id,
      name: req.body.name,
      sku: req.body.sku ?? "",
      slug: req.body.slug ?? "",
      categories: req.body.categories ?? [],
      images: product.images ?? [],
      bar_code: req.body.barcode ?? "",
      imei: req.body.imei ?? "",
      description: req.body.description ?? "",
      supplier: req.body.supplier ?? "",
      purchase_price: req.body.purchase_price ?? "",
      regular_price: req.body.regular_price ?? "",
      sale_price: req.body.sale_price ?? "",
      tax_status: req.body.tax_status ?? "",
      tax_class: req.body.tax_class ?? "",
      unit: req.body.unit ?? "",
      activate: req.body.activate ?? false,
    },
    shop: userFoundInMongo.store.type,
  });

  return res.status(201).send({ id: product.id });
};
