import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import {
  getExistingAppUserByEmailandPassword,
  getExistingAppUserByUsernamelandPassword,
} from "../../repository/spanner/get-app-user.js";
import { validateTypeFactory } from "../../util/ajvValidator.js";
import { createErrorResponse } from "../../util/errorReponse.js";

import type {
  Request,
  Response,
} from "express";
dotenv.config();

const createSignInBodyRequestWithEmail = {
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

const createSignInBodyRequestWithUsername = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  required: [
    "username",
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
};

const signin = async (req: Request, res: Response) => {
  let appUserId: string | undefined;
  if (req.body.email && !req.body.username && !validateTypeFactory(req.body, createSignInBodyRequestWithEmail))
    return createErrorResponse(res, SERVICE_ERRORS.invalidRequest);

  if (req.body.username && !req.body.email && !validateTypeFactory(req.body, createSignInBodyRequestWithUsername))
    return createErrorResponse(res, SERVICE_ERRORS.invalidRequest);

  if (req.body.email && !getExistingAppUserByEmailandPassword(req.body.email, req.body.password))
    return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  if (req.body.username && !getExistingAppUserByUsernamelandPassword(req.body.username, req.body.password))
    return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  if (req.body.email) appUserId = await getExistingAppUserByEmailandPassword(req.body.email, req.body.password);
  if (req.body.username) appUserId = await getExistingAppUserByUsernamelandPassword(req.body.username, req.body.password);

  if (!process.env["JWT_SECRET"]) return createErrorResponse(res, SERVICE_ERRORS.invalidJwtToken);
  const token = jwt.sign({ appUserId }, process.env["JWT_SECRET"]);

  return res.status(200).send({ jwtToken: token });
};

export default signin;