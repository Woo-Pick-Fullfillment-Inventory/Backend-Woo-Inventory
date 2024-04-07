import { Type } from "@sinclair/typebox";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";
import { firestoreRepository } from "../../repository/firestore/index.js";
import { UserFireStoreSchema } from "../../repository/firestore/models/user.type.js";

import type { Static } from "@sinclair/typebox";
import type {
  Request,
  Response,
} from "express";
dotenv.config();

const SERVICE_ERRORS = {
  invalidCredentials: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signin-failed",
    message: "invalid credentials",
  },
  invalidRequestType: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signin-failed",
    message: "invalid request",
  },
};

const SigninRequest = Type.Object({
  email_or_username: Type.String(),
  password: Type.String(),
});

export type SigninRequestType = Static<typeof SigninRequest>;

export const signin = async (req: Request, res: Response) => {
  const isSignInRequestTypeValid = isResponseTypeTrue(
    SigninRequest,
    req.body,
    false,
  );
  if (!isSignInRequestTypeValid.isValid) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** invalid signin request type  ${isSignInRequestTypeValid.errorMessage} **Expected** ${JSON.stringify(SigninRequest)} **RECEIVED** ${JSON.stringify(req.body)}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.invalidRequestType);
  }

  const userFoundByEmail = await firestoreRepository.user.getUserByEmail(
    req.body.email_or_username,
  );
  const userFoundByUsername = await firestoreRepository.user.getUserByUsername(
    req.body.email_or_username,
  );

  const userFound = userFoundByEmail ? userFoundByEmail : userFoundByUsername;

  if (!userFound)
    return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);
  const isUserFoundTypeValid = isResponseTypeTrue(
    UserFireStoreSchema,
    userFound,
    true,
  );
  if (!isUserFoundTypeValid.isValid) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 500 - Internal Server Error ***ERROR*** invalid user found type ${isUserFoundTypeValid.errorMessage} **Expected** ${JSON.stringify(UserFireStoreSchema)} **RECEIVED** ${JSON.stringify(userFound)}`,
    );
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const isPasswordMatched = await bcrypt.compare(
    req.body.password,
    userFound.password,
  );
  if (!isPasswordMatched)
    return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  await firestoreRepository.user.updateUserLastLogin(
    userFound.user_id,
    new Date().toISOString(),
  );

  return res.status(201).send({ jwtToken: `Bearer ${jwt.sign({ userId: userFound.user_id }, process.env["JWT_SECRET"] as string)}` });
};
