import { Type } from "@sinclair/typebox";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { performance } from "perf_hooks";

import { ORDERS_PER_PAGE } from "../../constants/size.constant.js";
import {
  fetchAllDataFromWoo,
  fromWooToFirestoreOrdersMapping,
} from "../../helpers/index.js";
import { createBasicAuthHeaderToken } from "../../modules/create-basic-auth-header.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { measureTime } from "../../modules/create-measure-timer.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";
import { verifyAuthorizationHeader } from "../../modules/create-verify-authorization-header.js";
import writeAllDataToFirestore from "../../modules/create-write-data-to-firestore-batch.js";
import { firestoreRepository } from "../../repository/firestore/index.js";
import {
  type OrderWooType,
  wooApiRepository,
} from "../../repository/woo-api/index.js";

import type {
  Request,
  Response,
} from "express";

dotenv.config();

const SERVICE_ERRORS = {
  notAuthorized: {
    statusCode: StatusCodes.UNAUTHORIZED,
    type: "/orders/sync-process/not-authorized",
    message: "not authorized",
  },
  resourceNotFound: {
    statusCode: StatusCodes.NOT_FOUND,
    type: "/orders/sync-process/not-found",
    message: "resource not found",
  },
  invalidRequestType: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/orders/sync-process/invalid-request-type",
    message: "invalid request",
  },
  dataSyncedAlready: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/orders/sync-process/synced-already",
    message: "orders synced",
  },
};

const SyncOrdersSchema = Type.Object({
  action: Type.String({ const: "sync-orders" }),
  date_after: Type.String({ format: "date-time" }),
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
      ],
    }),
  ),
});

export const syncOrders = async (req: Request, res: Response) => {
  const isSyncOrdersRequestTypeValid = isResponseTypeTrue(
    SyncOrdersSchema,
    req.body,
    false,
  );
  if (!isSyncOrdersRequestTypeValid.isValid) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** invalid sync Orders request type  ${isSyncOrdersRequestTypeValid.errorMessage} **Expected** ${JSON.stringify(SyncOrdersSchema)} **RECEIVED** ${JSON.stringify(req.body)}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.invalidRequestType);
  }

  const userId = verifyAuthorizationHeader(req.headers["authorization"]);
  if (!userId) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 401 - Not Authorized ***ERROR*** no decoded token from ${userId} header`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
  }

  const userFoundInFirestore =
    await firestoreRepository.user.getUserById(userId);
  if (!userFoundInFirestore) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 404 - Not Found ***ERROR*** user not found by id ${userId}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  if (userFoundInFirestore.sync.are_orders_synced) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** user ${userId} has already synced orders`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.dataSyncedAlready);
  }

  const wooBasicAuth = createBasicAuthHeaderToken(
    userFoundInFirestore.woo_credentials.token,
    userFoundInFirestore.woo_credentials.secret,
  );

  const baseUrl =
    process.env["NODE_ENV"] === "production"
      ? userFoundInFirestore.store.app_url
      : (process.env["WOO_BASE_URL"] as string);

  const { totalItems } = await wooApiRepository.order.getOrdersPagination({
    baseUrl: baseUrl,
    token: wooBasicAuth,
    perPage: 1,
    page: 1,
    dateAfter: req.body.date_after,
    status: req.body.status,
  });

  const startTimeGettingOrders = performance.now();
  const ordersFromWoo = await fetchAllDataFromWoo<OrderWooType>({
    baseUrl,
    wooBasicAuth,
    totalItems,
    perPage: ORDERS_PER_PAGE,
    endpoint: "order",
    dateAfter: req.body.date_after,
    status: req.body.status,
  });

  if (ordersFromWoo.length !== totalItems) {
    logger.log(
      "error",
      `${req.method} ${req.url} - 500 - Internal Server Error ***ERROR*** Orders Syncing failed`,
    );
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
  const endTimeGettingOrders = performance.now();
  logger.log(
    "info",
    `Total time taken to get Orders from WooCommerce: ${measureTime(startTimeGettingOrders, endTimeGettingOrders)} milliseconds`,
  );

  // what if internet connection is lost?
  const startTimeWritingToDb = performance.now();
  await writeAllDataToFirestore({
    data: fromWooToFirestoreOrdersMapping(ordersFromWoo),
    usecase: "orders",
    userId,
  });
  const endTimeWritingToDb = performance.now();
  logger.log(
    "info",
    `Total time taken to write data into DB: ${measureTime(startTimeWritingToDb, endTimeWritingToDb)} milliseconds`,
  );

  await firestoreRepository.user.updateUserOrdersSynced(userId, true);

  return res.sendStatus(201);
};