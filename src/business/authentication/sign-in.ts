import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { createErrorResponse } from "../../modules/create-error-response.js";
import logger from "../../modules/create-logger.js";
import { getUserByAttribute } from "../../repository/firestore/index.js";

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
};

// todo: add bcrypt
export const signin = async (req: Request, res: Response) => {
  const userFoundByEmail = await getUserByAttribute("email", req.body.emailOrUsername);
  const userFoundByUsername = await getUserByAttribute("username", req.body.emailOrUsername);

  const userFound = userFoundByEmail ? userFoundByEmail : userFoundByUsername;

  if (!userFound) return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  if (userFound.password !== req.body.password) return createErrorResponse(res, SERVICE_ERRORS.invalidCredentials);

  if (!process.env["JWT_SECRET"]) {
    logger.log("error", `JWT_SECRET ${process.env["JWT_SECRET"]} is not defined`);
    return res.send(500);
  }

  return res.status(200).send({ jwtToken: `Bearer ${jwt.sign({ userId: userFound.user_id }, process.env["JWT_SECRET"]) }` });
};
