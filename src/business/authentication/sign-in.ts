import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { validateTypeFactory } from "../../modules/create-ajv-validator.js";
import { _getAppUserByEmail } from "../../repository/spanner/index.js";
import { createErrorResponse } from "../../util/create-error-response.js";

import type {
  Request,
  Response,
} from "express";
dotenv.config();

const createSignInBodyRequest = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  required: [
    "email",
    "password",
  ],
  additionalProperties: false,
};

const SERVICE_ERRORS = {
  invalidRequest: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signin-failed",
    title: "invalid request",
  },
  invalidCredentials: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signin-failed",
    title: "invalid credentials",
  },
  invalidJwtToken: {
    statusCode: StatusCodes.UNAUTHORIZED,
    type: "/auth/signin-failed",
    title: "cannot generate response",
  },
  internalServerError: {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    type: "/auth/signin-failed",
    title: "internal server error",
  },
  databaseError: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signin-failed",
    title: "database error",
  },
};

const signin = async (req: Request, res: Response) => {
  if (!validateTypeFactory(req.body, createSignInBodyRequest)) return SERVICE_ERRORS.invalidRequest;

  const appUser = await _getAppUserByEmail(req.body.email);

  if (!appUser) return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  if (appUser.app_password !== req.body.password) return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  if (!process.env["JWT_SECRET"]) return createErrorResponse(res, SERVICE_ERRORS.invalidJwtToken);
  const token = jwt.sign({ appUserId: appUser.app_user_id }, process.env["JWT_SECRET"]);

  return res.status(200).send({ jwtToken: token });
};

export default signin;