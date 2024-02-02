import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { validateTypeFactory } from "../../modules/create-ajv-validator.js";
import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
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
  invalidCredentials: {
    statusCode: StatusCodes.BAD_REQUEST,
    type: "/auth/signin-failed",
    title: "invalid credentials",
  },
};

// todo: add bcrypt
const signin = async (req: Request, res: Response) => {
  if (!validateTypeFactory(req.body, createSignInBodyRequest)) {
    logger.log("error", `req.body ${JSON.stringify(req.body)} does not match the expected type`);
    return res.send(500);
  }

  const userFoundByEmail = await getUserByAttribute("email", req.body.emailOrUsername);
  const userFoundByUsername = await getUserByAttribute("username", req.body.emailOrUsername);

  const userFound = userFoundByEmail ? userFoundByEmail : userFoundByUsername;

  if (!userFound) return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  if (userFound.password !== req.body.password) return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  if (!process.env["JWT_SECRET"]) {
    logger.log("error", `JWT_SECRET ${process.env["JWT_SECRET"]} is not defined`);
    return res.send(500);
  }

  return res.status(200).send({ jwtToken: jwt.sign({ userId: userFound.user_id }, process.env["JWT_SECRET"]) });
};

export default signin;