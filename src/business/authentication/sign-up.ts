import dotenv from "dotenv";
import * as emailValidator from "email-validator";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

import { validateTypeFactory } from "../../modules/create-ajv-validator.js";
import { createBasicAuthHeaderToken } from "../../modules/create-basic-auth-header.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import {
  getUserByAttribute,
  insertUser,
} from "../../repository/firestore/index.js";
import { getSystemStatus } from "../../repository/woo-api/get-system-status.js";

import type {
  Request,
  Response,
} from "express";
dotenv.config();

const createUrlRequestBodySchema = {
  type: "object",
  properties: {
    appURL: { type: "string" },
    email: { type: "string" },
    username: { type: "string" },
    password: { type: "string" },
    passwordConfirmation: { type: "string" },
    token: { type: "string" },
  },
  required: [
    "appURL",
    "email",
    "username",
    "password",
    "passwordConfirmation",
    "token",
  ],
  additionalProperties: false,
};

const SERVICE_ERRORS = {
  invalidTokenOrAppUrl: {
    statusCode: StatusCodes.UNAUTHORIZED,
    type: "/auth/signup-failed",
    title: "invalid token or app url",
  },
  existingEmail: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    title: "Existing email",
  },
  existingUsername: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    title: "Existing username",
  },
  invalidEmail: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    title: "invalid email",
  },
  invalidPassword: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signup-failed",
    title: "invalid password",
  },
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const signup = async (req: Request, res: Response) => {

  if (!validateTypeFactory(req.body, createUrlRequestBodySchema)) {
    logger.log("error", `req.body ${JSON.stringify(req.body)} does not match the expected type`);
    return res.send(500);
  }

  if (await getUserByAttribute("email", req.body.email)) return createErrorResponse(res, SERVICE_ERRORS.existingEmail);

  if (await getUserByAttribute("username", req.body.username)) return createErrorResponse(res, SERVICE_ERRORS.existingUsername);

  if (!emailValidator.validate(req.body.email)) return createErrorResponse(res, SERVICE_ERRORS.invalidEmail);

  if (!passwordRegex.test(req.body.password) || req.body.password !== req.body.passwordConfirmation) return createErrorResponse(res, SERVICE_ERRORS.invalidPassword);

  const base_url =
    process.env["NODE_ENV"] === "production" ? req.body.appURL : process.env["WOO_BASE_URL"];
  const systemStatus = await getSystemStatus(
    `${base_url}`,
    createBasicAuthHeaderToken(
      req.body.token.split("|")[0],
      req.body.token.split("|")[1],
    ),
  );
  if (!systemStatus) return createErrorResponse(res, SERVICE_ERRORS.invalidTokenOrAppUrl);

  const userId = randomUUID();

  await insertUser({
    user_id: userId,
    store: { app_url: req.body.appURL },
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    woo_credentials: {
      token: req.body.token.split("|")[0],
      secret: req.body.token.split("|")[1],
    },
    authentication: {
      method: "woo_token",
      isAuthorized: true,
    },
  });

  if (!process.env["JWT_SECRET"]) {
    logger.log("error", `JWT_SECRET ${process.env["JWT_SECRET"]} is not defined`);
    return res.send(500);
  }

  return res.status(200).send({ jwtToken: jwt.sign({ userId }, process.env["JWT_SECRET"]) });
};

export default signup;