import { Type } from "@sinclair/typebox";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { firestoreMock } from "../../helpers/index.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";
import {
  getUserByEmail,
  getUserByUsername,
  updateUserLastLogin,
} from "../../repository/firestore/index.js";
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

if (process.env["NODE_ENV"] === "test") await firestoreMock.signIn();

export const signin = async (req: Request, res: Response) => {
  const isSignInRequestTypeValid = isResponseTypeTrue(SigninRequest, req.body, false);
  if (!isSignInRequestTypeValid.isValid) {
    logger.log("warn", `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** invalid signin request type  ${isSignInRequestTypeValid.errors[0]?.message} **Expected** ${JSON.stringify(SigninRequest)} **RECEIVED** ${JSON.stringify(req.body)}`);
    return createErrorResponse(res, SERVICE_ERRORS.invalidRequestType);
  }

  const userFoundByEmail = await getUserByEmail(req.body.email_or_username);
  const userFoundByUsername = await getUserByUsername(req.body.email_or_username);

  const userFound = userFoundByEmail ? userFoundByEmail : userFoundByUsername;

  if (!userFound) return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);
  const isUserFoundTypeValid = isResponseTypeTrue(UserFireStoreSchema, userFound, true);
  if (!isUserFoundTypeValid.isValid) {
    logger.log("warn", `${req.method} ${req.url} - 500 - Internal Server Error ***ERROR*** invalid user found type ${isUserFoundTypeValid.errors[0]?.message} **Expected** ${JSON.stringify(UserFireStoreSchema)} **RECEIVED** ${JSON.stringify(userFound)}`);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const isPasswordMatched = await bcrypt.compare(req.body.password, userFound.password);
  if (!isPasswordMatched) return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  if (!process.env["JWT_SECRET"]) {
    logger.log("error", `${req.method} ${req.url} - 500 - Internal Server Error ***ERROR***  JWT_SECRET is not defined`);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  await updateUserLastLogin(userFound.user_id, new Date().toISOString());

  return res.status(200).send({ jwtToken: `Bearer ${jwt.sign({ userId: userFound.user_id }, process.env["JWT_SECRET"]) }` });
};
