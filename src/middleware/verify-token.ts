import { StatusCodes } from "http-status-codes";

import { createErrorResponse } from "../modules/create-error-response.js";
import logger from "../modules/create-logger.js";
import { verifyAuthorizationHeader } from "../modules/create-verify-authorization-header.js";
import { firestoreRepository } from "../repository/firestore/index.js";

import type {
  NextFunction,
  Request,
  Response,
} from "express";

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
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers["authorization"]) {
      logger.log("error", "no authorization header found");
      return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
    }

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

    req.body.userId = userId;
    req.body.userFoundInFirestore = userFoundInFirestore;
    next();

  } catch (e) {
    logger.log("error", e);
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  throw new Error("unreachable code");
};
