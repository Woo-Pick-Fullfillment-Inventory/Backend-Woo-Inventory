import { Type } from "@sinclair/typebox";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { emailValidator } from "../../helpers/index.js";
import { createBasicAuthHeaderToken } from "../../modules/create-basic-auth-header.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { isResponseTypeTrue } from "../../modules/create-response-type-guard.js";
import { mongoRepository } from "../../repository/mongoDB/index.js";
import { wooApiRepository } from "../../repository/woo-api/index.js";

import type {
  Request,
  Response,
} from "express";

dotenv.config();

const SERVICE_ERRORS = {
  invalidTokenOrAppUrl: {
    statusCode: StatusCodes.UNAUTHORIZED,
    type: "/auth/signup-failed",
    message: "invalid token or app url",
  },
  existingEmail: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    message: "Existing email",
  },
  existingUsername: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    message: "Existing username",
  },
  invalidEmail: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    message: "invalid email",
  },
  invalidPassword: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    message: "invalid password",
  },
  invalidRequestType: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    message: "invalid request",
  },
};

const SignupRequest = Type.Object({
  app_url: Type.String(),
  email: Type.String(),
  username: Type.String(),
  password: Type.String(),
  password_confirmation: Type.String(),
  token: Type.String(),
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const signup = async (req: Request, res: Response) => {
  const isSignupRequestTypeValid = isResponseTypeTrue(
    SignupRequest,
    req.body,
    false,
  );
  if (!isSignupRequestTypeValid.isValid) {
    logger.log(
      "warn",
      `${req.method} ${req.url} - 400 - Bad Request ***ERROR*** invalid signup request type  ${isSignupRequestTypeValid.errorMessage} **Expected** ${JSON.stringify(SignupRequest)} **RECEIVED** ${JSON.stringify(req.body)}`,
    );
    return createErrorResponse(res, SERVICE_ERRORS.invalidRequestType);
  }

  if (await mongoRepository.user.getUserByEmail(req.body.email))
    return createErrorResponse(res, SERVICE_ERRORS.existingEmail);

  if (await mongoRepository.user.getUserByUsername(req.body.username))
    return createErrorResponse(res, SERVICE_ERRORS.existingUsername);

  if (!emailValidator(req.body.email))
    return createErrorResponse(res, SERVICE_ERRORS.invalidEmail);

  if (
    !passwordRegex.test(req.body.password) ||
    req.body.password !== req.body.password_confirmation
  )
    return createErrorResponse(res, SERVICE_ERRORS.invalidPassword);

  const systemStatusResult = await wooApiRepository.system.getSystemStatus({
    baseUrl: process.env["NODE_ENV"] === "production"
      ? req.body.app_url
      : process.env["WOO_BASE_URL"] as string,
    token: createBasicAuthHeaderToken(
      req.body.token.split("|")[0],
      req.body.token.split("|")[1],
    ),
  });
  // actually useless
  if (!systemStatusResult)
    return createErrorResponse(res, SERVICE_ERRORS.invalidTokenOrAppUrl);

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // todo : products can actually be synced from another users of same store
  const userInserted = await mongoRepository.user.insertUser({
    user_id: new ObjectId().toHexString(),
    store: { app_url: req.body.app_url },
    email: req.body.email,
    username: req.body.username,
    password: hashedPassword,
    woo_credentials: {
      token: req.body.token.split("|")[0],
      secret: req.body.token.split("|")[1],
    },
    authentication: {
      method: "woo_token",
      is_authorized: true,
    },
    last_login: new Date().toISOString(),
    sync: {
      are_products_synced: false,
      are_products_categories_synced: false,
      are_orders_synced: false,
    },
  });

  return res.status(201).send({ jwtToken: `Bearer ${jwt.sign({ user_id: userInserted.user_id }, process.env["JWT_SECRET"] as string)}` });
};

export default signup;
