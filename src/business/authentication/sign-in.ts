import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { validateTypeFactory } from "../../modules/create-ajv-validator.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import { getUserByAttribute } from "../../repository/firestore/index.js";

import type {
  Request,
  Response,
} from "express";
dotenv.config();

const createSignInBodyRequest = {
  type: "object",
  properties: {
    emailOrUsername: { type: "string" },
    password: { type: "string" },
  },
  required: [
    "emailOrUsername",
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
  if (!validateTypeFactory(req.body, createSignInBodyRequest)) return SERVICE_ERRORS.invalidRequest;

  const userByEmail = await getUserByAttribute("email", req.body.emailOrUsername);
  const userByUsername = await getUserByAttribute("username", req.body.emailOrUsername);

  const user = userByEmail ? userByEmail : userByUsername;

  if (!user) return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  if (user.password !== req.body.password) return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  if (!process.env["JWT_SECRET"]) return createErrorResponse(res, SERVICE_ERRORS.invalidJwtToken);
  const token = jwt.sign({ userId: user.user_id }, process.env["JWT_SECRET"]);

  return res.status(200).send({ jwtToken: token });
};

export default signin;