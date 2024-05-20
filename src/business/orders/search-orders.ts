import { Type } from "@sinclair/typebox";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeValid } from "../../modules/create-response-type-guard.js";
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
    type: "/orders/get-orders/not-authorized",
    message: "not authorized",
  },
  resourceNotFound: {
    statusCode: StatusCodes.NOT_FOUND,
    type: "/orders/get-orders/not-found",
    message: "resource not found",
  },
  invalidRequestType: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/orders/get-orders/invalid-request-type",
    message: "invalid request",
  },
  dataNotSynced: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/orders/get-orders/not-synced",
    message: "orders not synced",
  },
};

const sortingCriteria = Type.Object({
  field: Type.Union([ Type.Literal("date_created") ]),
  direction: Type.Union([
    Type.Literal("asc"),
    Type.Literal("desc"),
  ]),
});

const searchOrdersSchemaPagination = Type.Object({
  sorting_criteria: sortingCriteria,
  date_from: Type.String({ format: "date" }),
  date_to: Type.String({ format: "date" }),
  status: Type.Array(
    Type.String({
      enum: [
        "pending",
        "processing",
        "on-hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
        "trash",
      ],
    }),
  ),
  page: Type.Optional(Type.Number()),
  per_page: Type.Optional(Type.Number()),
  search_term: Type.Optional(Type.String()),
});

export const searchOrders = async (req: Request, res: Response) => {
  const isSearchOrdersRequestTypeValid = isResponseTypeValid(
    searchOrdersSchemaPagination,
    req.body,
    false,
  );

  if (!isSearchOrdersRequestTypeValid.isValid) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** invalid request type`,
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
      "warn",
      `${req.method} ${req.url} - 401 - Not Authorized ***ERROR*** no decoded token from ${userId} header`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
  }

  const userFoundInMongo = await mongoRepository.user.getUserById(
    userId,
    shopType,
  );
  if (!userFoundInMongo) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 404 - Not Found ***ERROR*** user not found by id ${userId}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  if (!userFoundInMongo.sync.are_orders_synced) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** user ${userId} did not sync orders`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.dataNotSynced);
  }

  const ordersFromMongo = await mongoRepository.order.getOrders({
    userId,
    shop: shopType,
    searchOptions: {
      date_from: new Date(req.body.date_from).toISOString(),
      date_to: new Date(req.body.date_to).toISOString(),
      status: req.body.status,
      page: req.body.page,
      per_page: req.body.per_page,
      search_term: req.body.search_term,
      sorting_criteria: {
        field: req.body.sorting_criteria.field,
        direction: req.body.sorting_criteria.direction,
      },
    },
  });

  return res.status(201).send({
    orders: ordersFromMongo.map((order) => {
      return {
        id: order.id,
        date_created: order.date_created,
        status: order.status,
        shipping: {
          first_name: order.shipping.first_name,
          last_name: order.shipping.last_name,
        },
        total_items: order.line_items.length,
      };
    }),
  });
};
