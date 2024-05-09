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
    type: "/auth/profile-setup-failed",
    message: "not authorized",
  },
  resourceNotFound: {
    statusCode: StatusCodes.NOT_FOUND,
    type: "/auth/profile-setup-failed",
    message: "resource not found",
  },
  invalidRequestType: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/profile-setup-failed",
    message: "invalid request",
  },
};

const profileSetupSchema = Type.Object({ action: Type.Union([ Type.Literal("setup-profile") ]) });

export const profileSetup = async (req: Request, res: Response) => {
  const isProfileSetupRequestTypeValid = isResponseTypeTrue(
    profileSetupSchema,
    req.body,
    false,
  );
  if (!isProfileSetupRequestTypeValid.isValid) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** invalid profile setup request type  ${isProfileSetupRequestTypeValid.errorMessage} **Expected** ${JSON.stringify(profileSetupSchema)} **RECEIVED** ${JSON.stringify(req.body)}`,
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

  const userFoundInMongo = await mongoRepository.user.getUserById(userId);
  if (!userFoundInMongo) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 404 - Not Found ***ERROR*** user not found by id ${userId}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  }

  // todo: adjust for all permissions and roles user may have
  await mongoRepository.collection.createCollection({
    collectionName: `user-${userId}-products`,
    caseType: "products",
  });
  await mongoRepository.collection.createCollection({
    collectionName: `user-${userId}-products`,
    caseType: "orders",
  });
  await mongoRepository.collection.createCollection({
    collectionName: `user-${userId}-products`,
    caseType: "categories",
  });

  return res.status(200).json({ message: "Profile setup successful" });
};
